import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";

export const jobQueue = new Queue("helpdesk", {
  connection: redisConnection(),
});
