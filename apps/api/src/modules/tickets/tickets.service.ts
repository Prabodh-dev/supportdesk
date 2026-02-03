import { prisma } from "../../db/prisma";
import { parsePagination } from "../../utils/pagination";
import type {
  TicketStatus,
  TicketPriority,
  TicketCategory,
} from "@prisma/client";

function buildWhereForAgent(q: any) {
  const where: any = {};

  if (q.status) where.status = q.status as TicketStatus;
  if (q.priority) where.priority = q.priority as TicketPriority;
  if (q.category) where.category = q.category as TicketCategory;
  if (q.assignedAgentId) where.assignedAgentId = q.assignedAgentId;
  if (q.teamId) where.teamId = q.teamId;

  if (q.q) {
    where.OR = [
      { title: { contains: q.q, mode: "insensitive" } },
      { description: { contains: q.q, mode: "insensitive" } },
    ];
  }

  return where;
}

export async function createTicket(userId: string, body: any) {
  return prisma.ticket.create({
    data: {
      title: body.title,
      description: body.description,
      category: body.category ?? "GENERAL",
      priority: body.priority ?? "MEDIUM",
      tags: body.tags ?? [],
      createdById: userId,
    },
    select: {
      id: true,
      ticketNo: true,
      title: true,
      status: true,
      priority: true,
      category: true,
      createdAt: true,
    },
  });
}

export async function listTicketsAgent(query: any) {
  const { page, limit, skip } = parsePagination(query);
  const where = buildWhereForAgent(query);

  const [total, items] = await prisma.$transaction([
    prisma.ticket.count({ where }),
    prisma.ticket.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        ticketNo: true,
        title: true,
        status: true,
        priority: true,
        category: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
        createdBy: { select: { id: true, email: true, name: true } },
        assignedAgent: { select: { id: true, email: true, name: true } },
        team: { select: { id: true, name: true } },
      },
    }),
  ]);

  return {
    meta: { page, limit, total, hasMore: skip + items.length < total },
    items,
  };
}

export async function listTicketsCustomer(userId: string, query: any) {
  const { page, limit, skip } = parsePagination(query);

  const where: any = { createdById: userId };
  if (query.status) where.status = query.status;
  if (query.q) {
    where.OR = [
      { title: { contains: query.q, mode: "insensitive" } },
      { description: { contains: query.q, mode: "insensitive" } },
    ];
  }

  const [total, items] = await prisma.$transaction([
    prisma.ticket.count({ where }),
    prisma.ticket.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        ticketNo: true,
        title: true,
        status: true,
        priority: true,
        category: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
        assignedAgent: { select: { id: true, email: true, name: true } },
        team: { select: { id: true, name: true } },
      },
    }),
  ]);

  return {
    meta: { page, limit, total, hasMore: skip + items.length < total },
    items,
  };
}

export async function getTicketByIdForUser(
  ticketId: string,
  actor: { id: string; role: string },
) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    select: {
      id: true,
      ticketNo: true,
      title: true,
      description: true,
      status: true,
      priority: true,
      category: true,
      tags: true,
      createdAt: true,
      updatedAt: true,
      createdById: true,
      createdBy: { select: { id: true, email: true, name: true } },
      assignedAgent: { select: { id: true, email: true, name: true } },
      team: { select: { id: true, name: true } },
      firstResponseAt: true,
      resolvedAt: true,
      closedAt: true,
    },
  });

  if (!ticket) {
    const err: any = new Error("Ticket not found");
    err.statusCode = 404;
    throw err;
  }

  const isCustomer = actor.role === "CUSTOMER";
  if (isCustomer && ticket.createdById !== actor.id) {
    const err: any = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }

  return ticket;
}

export async function updateStatus(ticketId: string, status: TicketStatus) {
  const data: any = { status };

  if (status === "RESOLVED") data.resolvedAt = new Date();
  if (status === "CLOSED") data.closedAt = new Date();

  if (
    status === "OPEN" ||
    status === "IN_PROGRESS" ||
    status === "WAITING_ON_CUSTOMER"
  ) {
    data.closedAt = null;
    data.resolvedAt = null;
  }

  return prisma.ticket.update({
    where: { id: ticketId },
    data,
    select: {
      id: true,
      ticketNo: true,
      status: true,
      resolvedAt: true,
      closedAt: true,
      updatedAt: true,
    },
  });
}

export async function assign(ticketId: string, body: any) {
  const data: any = {};
  if ("assignedAgentId" in body) data.assignedAgentId = body.assignedAgentId;
  if ("teamId" in body) data.teamId = body.teamId;
  if (body.priority) data.priority = body.priority;

  return prisma.ticket.update({
    where: { id: ticketId },
    data,
    select: {
      id: true,
      ticketNo: true,
      priority: true,
      assignedAgent: { select: { id: true, email: true, name: true } },
      team: { select: { id: true, name: true } },
      updatedAt: true,
    },
  });
}
