import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import * as s from "./messages.service";
import { audit } from "../../utils/audit";
import { jobQueue } from "../../jobs/queue";
import { prisma } from "../../db/prisma";
import { env } from "../../config/env";

function ticketLink(ticketId: string) {
  const base = env.WEB_BASE_URL ?? "http://localhost:3000";
  return `${base}/tickets/${ticketId}`;
}

export const list = asyncHandler(async (req: Request, res: Response) => {
  const data = await s.listMessages(req.params.ticketId, req.user!);
  res.json(data);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const data = await s.createMessage(
    req.params.ticketId,
    req.user as any,
    req.body,
  );

  await audit({
    action: "MESSAGE_CREATED",
    actorId: req.user!.id,
    ticketId: req.params.ticketId,
    meta: { isInternal: Boolean(req.body.isInternal) },
  });

  const actorRole = req.user!.role;
  const isInternal = Boolean(req.body.isInternal);
  if ((actorRole === "AGENT" || actorRole === "ADMIN") && !isInternal) {
    const t = await prisma.ticket.findUnique({
      where: { id: req.params.ticketId },
      select: {
        id: true,
        ticketNo: true,
        createdBy: { select: { email: true } },
      },
    });

    if (t?.createdBy.email) {
      await jobQueue.add(
        "email.agent_replied",
        {
          to: t.createdBy.email,
          subject: `Update on Ticket #${t.ticketNo}`,
          html: `<p>Support replied to your ticket <b>#${t.ticketNo}</b>.</p><p>View: <a href="${ticketLink(t.id)}">Open ticket</a></p>`,
        },
        { removeOnComplete: true, removeOnFail: 100 },
      );
    }
  }

  res.status(201).json(data);
});
