import "dotenv/config";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { prisma } from "./db/prisma";
import { createApp } from "./app";

async function main() {
  await prisma.$connect();
  logger.info("DB connected");

  const app = createApp();
  app.listen(env.PORT, () => {
    logger.info(`API running on http://localhost:${env.PORT}`);
  });
}

main().catch((e) => {
  logger.error(e, "Startup failed");
  process.exit(1);
});
