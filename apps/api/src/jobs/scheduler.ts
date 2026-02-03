import { jobQueue } from "./queue";
import { env } from "../config/env";

export async function startScheduler() {
  await jobQueue.add(
    "sla.check",
    {},
    {
      repeat: { every: env.SLA_CHECK_EVERY_SEC * 1000 },
      removeOnComplete: true,
      removeOnFail: 1000,
    },
  );
}
