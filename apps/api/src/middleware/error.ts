import type { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ error: { message: "Route not found" } });
}

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const status = err.statusCode ?? 500;
  if (status >= 500) logger.error({ err }, "Unhandled error");

  res.status(status).json({
    error: {
      message: err.message ?? "ServerError",
      details: err.details ?? undefined,
    },
  });
}
