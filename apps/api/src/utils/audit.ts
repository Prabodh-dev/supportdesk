import { prisma } from "../db/prisma";
import type { AuditAction } from "@prisma/client";

export async function audit(input: {
  action: AuditAction;
  actorId?: string;
  ticketId?: string;
  meta?: any;
}) {
  await prisma.auditLog.create({
    data: {
      action: input.action,
      actorId: input.actorId,
      ticketId: input.ticketId,
      meta: input.meta,
    },
  });
}
