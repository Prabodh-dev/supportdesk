import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";
import { sendEmail } from "./mailer";
import { prisma } from "../db/prisma";

export function startWorker() {
  const worker = new Worker(
    "helpdesk",
    async (job) => {
      switch (job.name) {
        case "email.ticket_created":
        case "email.agent_replied":
        case "email.status_changed": {
          await sendEmail(job.data);
          return;
        }

        case "sla.check": {
          const now = new Date();

          const firstResponseBreaches = await prisma.ticket.findMany({
            where: {
              firstResponseAt: null,
              status: { in: ["OPEN", "IN_PROGRESS", "WAITING_ON_CUSTOMER"] },
            },
            select: {
              id: true,
              ticketNo: true,
              createdAt: true,
              slaFirstResponseMin: true,
              createdBy: { select: { email: true } },
            },
            orderBy: { createdAt: "asc" },
            take: 50,
          });

          for (const t of firstResponseBreaches) {
            const minutes =
              (now.getTime() - new Date(t.createdAt).getTime()) / 60000;
            if (minutes >= t.slaFirstResponseMin) {
              await prisma.auditLog.create({
                data: {
                  action: "TICKET_STATUS_CHANGED",
                  ticketId: t.id,
                  meta: {
                    sla: "FIRST_RESPONSE_BREACH",
                    minutes: Math.floor(minutes),
                    ticketNo: t.ticketNo,
                  },
                },
              });
            }
          }

          const resolutionBreaches = await prisma.ticket.findMany({
            where: {
              status: { in: ["OPEN", "IN_PROGRESS", "WAITING_ON_CUSTOMER"] },
              resolvedAt: null,
            },
            select: {
              id: true,
              ticketNo: true,
              createdAt: true,
              slaResolutionMin: true,
              createdBy: { select: { email: true } },
            },
            orderBy: { createdAt: "asc" },
            take: 50,
          });

          for (const t of resolutionBreaches) {
            const minutes =
              (now.getTime() - new Date(t.createdAt).getTime()) / 60000;
            if (minutes >= t.slaResolutionMin) {
              await prisma.auditLog.create({
                data: {
                  action: "TICKET_STATUS_CHANGED",
                  ticketId: t.id,
                  meta: {
                    sla: "RESOLUTION_BREACH",
                    minutes: Math.floor(minutes),
                    ticketNo: t.ticketNo,
                  },
                },
              });
            }
          }

          return;
        }

        default:
          return;
      }
    },
    { connection: redisConnection() },
  );

  worker.on("failed", (job, err) => {
    console.error("Job failed:", job?.name, err);
  });

  return worker;
}
