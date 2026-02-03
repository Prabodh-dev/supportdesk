import "dotenv/config";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { prisma } from "./db/prisma";
import { createApp } from "./app";
import { startWorker } from "./jobs/worker";
import { startScheduler } from "./jobs/scheduler";

async function main() {
  await prisma.$connect();
  logger.info("DB connected");

  if (env.REDIS_URL) {
    startWorker();
    await startScheduler();
    logger.info("Worker + Scheduler started");
  } else {
    logger.warn("REDIS_URL not set -> jobs disabled");
  }

  const app = createApp();
  app.listen(env.PORT, () => {
    logger.info(`API running on http://localhost:${env.PORT}`);
  });
}

main().catch((e) => {
  logger.error(e, "Startup failed");
  process.exit(1);
});
