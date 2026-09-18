import express from "express";
import router from "./apis/index";
import helmet from "helmet";
import { errorHandler } from "./errors/error-handler";
import { notFoundHandler } from "./errors/not-found";
import { createApiRateLimiter } from "./middleware/rate-limit";
import { redisService } from "./services/redis";
import session from "express-session";
import { RedisStore } from "connect-redis";
import { ensureMinioBucket } from "./services/minio";
import { healthService } from "./services/health";
import { prisma } from "./services/prisma";
import { requestLogger } from "./middleware/request-logger";
import { requestId } from "./middleware/request-id";
import cors from "cors";
const app = express();
app.set("trust proxy", 1);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});
app.use(express.json());
app.use(requestId);
app.use(requestLogger);
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
const PORT = process.env.PORT || 3000;
app.use(
  session({
    store: new RedisStore({
      client: redisService.getClient(),
      prefix: "sess:",
    }) as unknown as session.Store,
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  }),
);

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "securevault-api",
    timestamp: new Date().toISOString(),
  });
});
app.get("/ready", async (_req, res) => {
  const result = await healthService.checkReadiness();

  res.status(result.ready ? 200 : 503).json({
    status: result.ready ? "ready" : "not_ready",
    service: "securevault-api",
    checks: result.checks,
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", router);
app.use(notFoundHandler);
app.use(errorHandler);
let server: ReturnType<typeof app.listen>;

async function startServer() {
  await prisma.$connect();
  await prisma.$queryRaw`SELECT 1`;
  await redisService.connect();

  app.use(createApiRateLimiter());
  await ensureMinioBucket();

  server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

const shutdown = async (signal: string) => {
  server.close(async () => {
    try {
      await prisma.$disconnect();

      const redis = redisService.getClient();

      if (redis.isOpen) {
        await redis.quit();
      }

      console.log("Graceful shutdown completed.");
      process.exit(0);
    } catch (error) {
      console.error("Error during shutdown:", error);
      process.exit(1);
    }
  });
};

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
