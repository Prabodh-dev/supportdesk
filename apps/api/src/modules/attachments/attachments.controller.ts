import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import * as s from "./attachments.service";
import { audit } from "../../utils/audit";

export const presign = asyncHandler(async (req: Request, res: Response) => {
  const data = await s.presignUpload(req.user!, req.body);

  await audit({
    action: "ATTACHMENT_PRESIGNED",
    actorId: req.user!.id,
    ticketId: req.body.ticketId,
    meta: {
      attachmentId: data.attachment.id,
      mimeType: req.body.mimeType,
      sizeBytes: req.body.sizeBytes,
    },
  });

  res.status(201).json(data);
});

export const confirm = asyncHandler(async (req: Request, res: Response) => {
  const data = await s.confirmUpload(req.user!, req.body.attachmentId);

  await audit({
    action: "ATTACHMENT_CONFIRMED",
    actorId: req.user!.id,
    meta: { attachmentId: req.body.attachmentId },
  });

  res.json(data);
});

export const download = asyncHandler(async (req: Request, res: Response) => {
  const data = await s.getDownloadUrl(req.user!, req.params.id);
  res.json(data);
});
