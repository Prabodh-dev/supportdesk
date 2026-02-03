import crypto from "crypto";
import {
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { prisma } from "../../db/prisma";
import { env } from "../../config/env";
import { s3Client } from "../../config/s3";
import { ensureTicketAccess } from "../tickets/ticketAccess";

function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}

export async function presignUpload(
  actor: { id: string; role: string },
  input: {
    ticketId: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
  },
) {
  if (input.sizeBytes > env.MAX_UPLOAD_BYTES) {
    const err: any = new Error(
      `File too large. Max ${env.MAX_UPLOAD_BYTES} bytes`,
    );
    err.statusCode = 413;
    throw err;
  }

  await ensureTicketAccess(input.ticketId, actor);

  const key = `tickets/${input.ticketId}/${Date.now()}-${crypto.randomBytes(8).toString("hex")}-${safeName(
    input.originalName,
  )}`;

  const attachment = await prisma.attachment.create({
    data: {
      key,
      status: "PENDING",
      originalName: input.originalName,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
      uploadedById: actor.id,
      ticketId: input.ticketId,
    },
    select: {
      id: true,
      key: true,
      status: true,
      originalName: true,
      mimeType: true,
      sizeBytes: true,
      ticketId: true,
    },
  });

  const client = s3Client();
  const cmd = new PutObjectCommand({
    Bucket: env.S3_BUCKET!,
    Key: key,
    ContentType: input.mimeType,
  });

  const uploadUrl = await getSignedUrl(client, cmd, {
    expiresIn: env.S3_SIGNED_URL_EXPIRES_SEC,
  });

  return { attachment, uploadUrl };
}

export async function confirmUpload(
  actor: { id: string; role: string },
  attachmentId: string,
) {
  const att = await prisma.attachment.findUnique({
    where: { id: attachmentId },
    select: {
      id: true,
      key: true,
      uploadedById: true,
      ticketId: true,
      status: true,
    },
  });

  if (!att) {
    const err: any = new Error("Attachment not found");
    err.statusCode = 404;
    throw err;
  }

  if (att.uploadedById !== actor.id) {
    const err: any = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }

  if (!att.ticketId) {
    const err: any = new Error("Attachment missing ticket");
    err.statusCode = 400;
    throw err;
  }

  await ensureTicketAccess(att.ticketId, actor);

  const client = s3Client();
  try {
    await client.send(
      new HeadObjectCommand({ Bucket: env.S3_BUCKET!, Key: att.key }),
    );
  } catch {
    const err: any = new Error("Upload not found in S3 yet");
    err.statusCode = 400;
    throw err;
  }

  const updated = await prisma.attachment.update({
    where: { id: attachmentId },
    data: { status: "UPLOADED" },
    select: { id: true, status: true },
  });

  return { attachment: updated };
}

export async function getDownloadUrl(
  actor: { id: string; role: string },
  attachmentId: string,
) {
  const att = await prisma.attachment.findUnique({
    where: { id: attachmentId },
    select: {
      id: true,
      key: true,
      ticketId: true,
      status: true,
      originalName: true,
      mimeType: true,
    },
  });

  if (!att) {
    const err: any = new Error("Attachment not found");
    err.statusCode = 404;
    throw err;
  }

  if (!att.ticketId) {
    const err: any = new Error("Attachment missing ticket");
    err.statusCode = 400;
    throw err;
  }

  await ensureTicketAccess(att.ticketId, actor);

  const client = s3Client();
  const cmd = new GetObjectCommand({ Bucket: env.S3_BUCKET!, Key: att.key });
  const downloadUrl = await getSignedUrl(client, cmd, {
    expiresIn: env.S3_SIGNED_URL_EXPIRES_SEC,
  });

  return {
    downloadUrl,
    attachment: {
      id: att.id,
      originalName: att.originalName,
      mimeType: att.mimeType,
      status: att.status,
    },
  };
}
