import express from "express";
import path from "path";
import router from "./apis/index";
import helmet from "helmet";
import { errorHandler } from "./errors/error-handler";
import { notFoundHandler } from "./errors/not-found";
import { apiRateLimiter } from "./middleware/rate-limit";
import { redisService } from "./services/redis";
import session from "express-session";
const app = express();

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
// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

const PORT = process.env.PORT || 3000;
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    },
  }),
);
app.use(apiRateLimiter);
app.use("/uploads", express.static(path.resolve("uploads")));
app.use("/api", router);
app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  await redisService.connect();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
