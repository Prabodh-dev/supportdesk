import { prisma } from "../../db/prisma";
import { ensureTicketAccess } from "../tickets/ticketAccess";

function computeType(actorRole: string, isInternal: boolean) {
  if (isInternal) return "INTERNAL_NOTE" as const;
  if (actorRole === "CUSTOMER") return "CUSTOMER_REPLY" as const;
  return "AGENT_REPLY" as const;
}

export async function listMessages(
  ticketId: string,
  actor: { id: string; role: string },
) {
  await ensureTicketAccess(ticketId, actor);

  const where: any = { ticketId };
  if (actor.role === "CUSTOMER") where.isInternal = false;

  const messages = await prisma.ticketMessage.findMany({
    where,
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      type: true,
      body: true,
      isInternal: true,
      createdAt: true,
      author: { select: { id: true, email: true, name: true, role: true } },
      attachments: {
        select: {
          id: true,
          originalName: true,
          mimeType: true,
          sizeBytes: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return { messages };
}

export async function createMessage(
  ticketId: string,
  actor: { id: string; role: "ADMIN" | "AGENT" | "CUSTOMER" },
  body: { body: string; isInternal?: boolean; attachmentIds?: string[] },
) {
  const ticket = await ensureTicketAccess(ticketId, actor);

  const isInternal = Boolean(body.isInternal);
  if (isInternal && actor.role === "CUSTOMER") {
    const err: any = new Error("Customers cannot create internal notes");
    err.statusCode = 403;
    throw err;
  }

  const type = computeType(actor.role, isInternal);

  const attachmentIds = body.attachmentIds ?? [];
  if (attachmentIds.length) {
    const attachments = await prisma.attachment.findMany({
      where: {
        id: { in: attachmentIds },
      },
      select: {
        id: true,
        uploadedById: true,
        ticketId: true,
        messageId: true,
        status: true,
      },
    });

    if (attachments.length !== attachmentIds.length) {
      const err: any = new Error("One or more attachments not found");
      err.statusCode = 400;
      throw err;
    }

    for (const a of attachments) {
      if (a.uploadedById !== actor.id) {
        const err: any = new Error("You can only attach your own uploads");
        err.statusCode = 403;
        throw err;
      }
      if (a.ticketId !== ticketId) {
        const err: any = new Error("Attachment does not belong to this ticket");
        err.statusCode = 400;
        throw err;
      }
      if (a.messageId) {
        const err: any = new Error("Attachment already used");
        err.statusCode = 400;
        throw err;
      }
    }
  }

  const result = await prisma.$transaction(async (tx) => {
    const msg = await tx.ticketMessage.create({
      data: {
        ticketId,
        authorId: actor.id,
        type,
        body: body.body,
        isInternal,
      },
      select: {
        id: true,
        type: true,
        body: true,
        isInternal: true,
        createdAt: true,
        author: { select: { id: true, email: true, name: true, role: true } },
      },
    });

    if (attachmentIds.length) {
      await tx.attachment.updateMany({
        where: { id: { in: attachmentIds } },
        data: { messageId: msg.id, status: "UPLOADED" },
      });
    }

    const isAgentPublicReply =
      (actor.role === "AGENT" || actor.role === "ADMIN") && !isInternal;
    if (isAgentPublicReply) {
      const update: any = {};
      if (!ticket.firstResponseAt) update.firstResponseAt = new Date();
      if (ticket.status === "OPEN") update.status = "IN_PROGRESS";
      if (Object.keys(update).length) {
        await tx.ticket.update({ where: { id: ticketId }, data: update });
      }
    }

    const attachments = attachmentIds.length
      ? await tx.attachment.findMany({
          where: { id: { in: attachmentIds } },
          select: {
            id: true,
            originalName: true,
            mimeType: true,
            sizeBytes: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: "asc" },
        })
      : [];

    return { message: { ...msg, attachments } };
  });

  return result;
}
