import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import * as s from "./tickets.service";
import { audit } from "../../utils/audit";
import { jobQueue } from "../../jobs/queue";
import { env } from "../../config/env";
import { prisma } from "../../db/prisma";

function ticketLink(ticketId: string) {
  const base = env.WEB_BASE_URL ?? "http://localhost:3000";
  return `${base}/tickets/${ticketId}`;
}

export const create = asyncHandler(async (req: Request, res: Response) => {
  const ticket = await s.createTicket(req.user!.id, req.body);

  await audit({
    action: "TICKET_CREATED",
    actorId: req.user!.id,
    ticketId: ticket.id,
    meta: {
      ticketNo: ticket.ticketNo,
      category: ticket.category,
      priority: ticket.priority,
    },
  });

  const customer = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { email: true },
  });
  if (customer?.email) {
    await jobQueue.add(
      "email.ticket_created",
      {
        to: customer.email,
        subject: `Ticket #${ticket.ticketNo} created`,
        html: `<p>Your ticket <b>#${ticket.ticketNo}</b> has been created.</p><p>Track: <a href="${ticketLink(ticket.id)}">Open ticket</a></p>`,
      },
      { removeOnComplete: true, removeOnFail: 100 },
    );
  }

  res.status(201).json({ ticket });
});

export const list = asyncHandler(async (req: Request, res: Response) => {
  const role = req.user!.role;

  if (role === "CUSTOMER") {
    const data = await s.listTicketsCustomer(req.user!.id, req.query);
    return res.json(data);
  }

  const data = await s.listTicketsAgent(req.query);
  res.json(data);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const ticket = await s.getTicketByIdForUser(req.params.id, req.user!);
  res.json({ ticket });
});

export const setStatus = asyncHandler(async (req: Request, res: Response) => {
  const updated = await s.updateStatus(req.params.id, req.body.status);

  await audit({
    action: "TICKET_STATUS_CHANGED",
    actorId: req.user!.id,
    ticketId: req.params.id,
    meta: { status: updated.status },
  });

  const t = await prisma.ticket.findUnique({
    where: { id: req.params.id },
    select: {
      id: true,
      ticketNo: true,
      createdBy: { select: { email: true } },
      status: true,
    },
  });

  if (t?.createdBy.email) {
    await jobQueue.add(
      "email.status_changed",
      {
        to: t.createdBy.email,
        subject: `Ticket #${t.ticketNo} status: ${t.status}`,
        html: `<p>Your ticket <b>#${t.ticketNo}</b> status is now <b>${t.status}</b>.</p><p>Track: <a href="${ticketLink(t.id)}">Open ticket</a></p>`,
      },
      { removeOnComplete: true, removeOnFail: 100 },
    );
  }

  res.json({ ticket: updated });
});

export const assign = asyncHandler(async (req: Request, res: Response) => {
  const updated = await s.assign(req.params.id, req.body);

  await audit({
    action: "TICKET_ASSIGNED",
    actorId: req.user!.id,
    ticketId: req.params.id,
    meta: {
      assignedAgent: updated.assignedAgent?.id ?? null,
      team: updated.team?.id ?? null,
      priority: updated.priority,
    },
  });

  res.json({ ticket: updated });
});
