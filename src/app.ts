import express from "express";
import router from "./apis/index";
import helmet from "helmet";
import { errorHandler } from "./errors/error-handler";
import { notFoundHandler } from "./errors/not-found";
import { apiRateLimiter } from "./middleware/rate-limit";
import { redisService } from "./services/redis";
import session from "express-session";
const app = express();

app.use(helmet());
app.use(express.json());
// app.use(cors());

const PORT = process.env.PORT || 3000;
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },
  }),
);
app.use(apiRateLimiter);
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