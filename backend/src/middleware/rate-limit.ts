import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redisService } from "../services/redis";

// export const apiRateLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   limit: 100,
//   standardHeaders: "draft-8",
//   legacyHeaders: false,
//   message: {
//     message: "Too many requests, please try again later.",
//     code: "TOO_MANY_REQUESTS",
//   },
//   store: new RedisStore({
//     sendCommand: (...args: string[]) =>
//       redisService.getClient().sendCommand(args),
//   }),
// });

export function createApiRateLimiter() {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,

    message: {
      message: "Too many requests, please try again later.",
      code: "TOO_MANY_REQUESTS",
    },

    store: new RedisStore({
      sendCommand: (...args: string[]) =>
        redisService.getClient().sendCommand(args),
    }),
  });
}
