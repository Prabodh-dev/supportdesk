import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import * as s from "./attachments.service";

export const presign = asyncHandler(async (req: Request, res: Response) => {
  const data = await s.presignUpload(req.user!, req.body);
  res.status(201).json(data);
});

export const confirm = asyncHandler(async (req: Request, res: Response) => {
  const data = await s.confirmUpload(req.user!, req.body.attachmentId);
  res.json(data);
});

export const download = asyncHandler(async (req: Request, res: Response) => {
  const data = await s.getDownloadUrl(req.user!, req.params.id);
  res.json(data);
});
