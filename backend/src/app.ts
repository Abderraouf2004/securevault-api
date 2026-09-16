import express from "express";
// import path from "path";
import router from "./apis/index";
import helmet from "helmet";
import { errorHandler } from "./errors/error-handler";
import { notFoundHandler } from "./errors/not-found";
// import { apiRateLimiter } from "./middleware/rate-limit";
import { createApiRateLimiter } from "./middleware/rate-limit";
import { redisService } from "./services/redis";
import session from "express-session";
import { RedisStore } from "connect-redis";
import { ensureMinioBucket } from "./services/minio";
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
import cors from "cors";
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
      // secure: process.env.NODE_ENV === "production",
      secure: false,
      sameSite: "lax",
      // sameSite: "none",
    },
  }),
);
// app.use(apiRateLimiter);
// app.use("/uploads", express.static(path.resolve("uploads")));
app.use("/api", router);
app.use(notFoundHandler);
app.use(errorHandler);
async function startServer() {
  await redisService.connect();
  console.log("Redis isOpen:", redisService.getClient().isOpen);
  console.log("Redis isReady:", redisService.getClient().isReady);
  await ensureMinioBucket();

  app.use(createApiRateLimiter());

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
