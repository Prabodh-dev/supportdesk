import { prisma } from "../../db/prisma";

export async function ensureTicketAccess(
  ticketId: string,
  actor: { id: string; role: string },
) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    select: {
      id: true,
      createdById: true,
      status: true,
      firstResponseAt: true,
      createdAt: true,
    },
  });

  if (!ticket) {
    const err: any = new Error("Ticket not found");
    err.statusCode = 404;
    throw err;
  }

  if (actor.role === "CUSTOMER" && ticket.createdById !== actor.id) {
    const err: any = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }

  return ticket;
}
