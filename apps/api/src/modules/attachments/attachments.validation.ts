import { z } from "zod";

export const presignSchema = z.object({
  body: z.object({
    ticketId: z.string().min(1),
    originalName: z.string().min(1).max(200),
    mimeType: z.string().min(1).max(120),
    sizeBytes: z.number().int().positive(),
  }),
});

export const confirmSchema = z.object({
  body: z.object({
    attachmentId: z.string().min(1),
  }),
});

export const downloadSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});
