import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";

import { env } from "./config/env";
import { logger } from "./config/logger";
import routes from "./routes";
import { notFound, errorHandler } from "./middleware/error";

export function createApp() {
  const app = express();

  app.use(pinoHttp({ logger }));

  app.use(helmet());
  app.use(compression());
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());

  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      limit: 120,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.use(
    cors({
      origin: env.CORS_ORIGIN
        ? env.CORS_ORIGIN.split(",").map((s) => s.trim())
        : true,
      credentials: true,
    }),
  );

  app.use("/api/v1", routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
