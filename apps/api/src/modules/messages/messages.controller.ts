import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import * as s from "./messages.service";

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
  res.status(201).json(data);
});
