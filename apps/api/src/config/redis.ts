import IORedis from "ioredis";
import { env } from "./env";

export function redisConnection() {
  if (!env.REDIS_URL) {
    const err: any = new Error("REDIS_URL not set");
    err.statusCode = 500;
    throw err;
  }
  return new IORedis(env.REDIS_URL, { maxRetriesPerRequest: null });
}
