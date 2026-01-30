import { z } from "zod";

const Status = z.enum([
  "OPEN",
  "IN_PROGRESS",
  "WAITING_ON_CUSTOMER",
  "RESOLVED",
  "CLOSED",
]);
const Priority = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
const Category = z.enum(["GENERAL", "LOGIN", "PAYMENT", "BUG", "OTHER"]);

export const createTicketSchema = z.object({
  body: z.object({
    title: z.string().min(4).max(120),
    description: z.string().min(10).max(5000),
    category: Category.optional(),
    priority: Priority.optional(),
    tags: z.array(z.string().min(1).max(30)).max(10).optional(),
  }),
});

export const listTicketsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    q: z.string().optional(),
    status: Status.optional(),
    priority: Priority.optional(),
    category: Category.optional(),
    assignedAgentId: z.string().optional(),
    teamId: z.string().optional(),
  }),
});

export const ticketIdSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const updateStatusSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    status: Status,
  }),
});

export const assignTicketSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    assignedAgentId: z.string().nullable().optional(),
    teamId: z.string().nullable().optional(),
    priority: Priority.optional(),
  }),
});
