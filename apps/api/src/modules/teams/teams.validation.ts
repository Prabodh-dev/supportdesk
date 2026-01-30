import { z } from "zod";

export const createTeamSchema = z.object({
  body: z.object({
    name: z.string().min(2),
  }),
});

export const addMemberSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    userId: z.string().min(1),
  }),
});
