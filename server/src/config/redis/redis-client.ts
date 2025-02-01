import Redis from "ioredis";
import logger from "../../utils/logger";

const redisClient = new Redis({
  host: process.env.REDIS_HOST || "redis",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD || "",
  db: 0, // Default Redis DB
  retryStrategy: (times: number) => {
    // Optional: Retry strategy in case of connection failure
    const delay = Math.min(times * 50, 2000); // Exponential backoff (max 2 seconds)
    return delay;
  },
});

redisClient.on("connect", () => {
  logger.info("Connected to Redis");
});

redisClient.on("error", (err) => {
  logger.error("Redis error:", err);
});

redisClient.on("close", () => {
  logger.info("Redis connection closed");
});

export default redisClient;
