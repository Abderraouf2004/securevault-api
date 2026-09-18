import { prisma } from "./prisma";
import { redisService } from "./redis";

export const healthService = {
  checkReadiness: async () => {
    const checks = {
      database: false,
      redis: false,
    };

    try {
      await prisma.$queryRaw`SELECT 1`;
      checks.database = true;
    } catch {}

    try {
      const redis = redisService.getClient();

      if (redis.isReady) {
        await redis.ping();
        checks.redis = true;
      }
    } catch {}

    const ready = checks.database && checks.redis;

    return {
      ready,
      checks,
    };
  },
};
