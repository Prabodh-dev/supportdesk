import { S3Client } from "@aws-sdk/client-s3";
import { env } from "./env";

export function requireS3() {
  if (
    !env.S3_BUCKET ||
    !env.S3_REGION ||
    !env.AWS_ACCESS_KEY_ID ||
    !env.AWS_SECRET_ACCESS_KEY
  ) {
    const err: any = new Error(
      "S3 is not configured. Set S3_BUCKET, S3_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY",
    );
    err.statusCode = 500;
    throw err;
  }
}

export function s3Client() {
  requireS3();
  return new S3Client({
    region: env.S3_REGION,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
    },
  });
}
