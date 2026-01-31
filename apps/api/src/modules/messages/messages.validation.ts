import { z } from "zod";

export const ticketIdParamSchema = z.object({
  params: z.object({
    ticketId: z.string().min(1),
  }),
});

export const createMessageSchema = z.object({
  params: z.object({
    ticketId: z.string().min(1),
  }),
  body: z.object({
    body: z.string().min(1).max(8000),
    isInternal: z.boolean().optional(),
    attachmentIds: z.array(z.string().min(1)).max(10).optional(),
  }),
});
