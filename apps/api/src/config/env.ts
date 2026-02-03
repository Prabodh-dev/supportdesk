import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(4000),

  DATABASE_URL: z.string().min(1),

  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),

  ACCESS_TOKEN_TTL_MIN: z.coerce.number().default(15),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().default(7),

  CORS_ORIGIN: z.string().optional(),

  S3_BUCKET: z.string().min(1).optional(),
  S3_REGION: z.string().min(1).optional(),
  AWS_ACCESS_KEY_ID: z.string().min(1).optional(),
  AWS_SECRET_ACCESS_KEY: z.string().min(1).optional(),
  S3_SIGNED_URL_EXPIRES_SEC: z.coerce.number().default(900),
  MAX_UPLOAD_BYTES: z.coerce.number().default(10 * 1024 * 1024),

  REDIS_URL: z.string().min(1).optional(),
  SLA_CHECK_EVERY_SEC: z.coerce.number().default(60),

  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional(),

  WEB_BASE_URL: z.string().optional(),
});

export const env = envSchema.parse(process.env);
