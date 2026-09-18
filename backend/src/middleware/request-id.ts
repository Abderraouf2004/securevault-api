import { randomUUID } from "crypto";
import type { Request, Response, NextFunction } from "express";

export const requestId = (req: Request, res: Response, next: NextFunction) => {
  const id = req.header("X-Request-ID") ?? randomUUID();

  req.requestId = id;

  res.setHeader("X-Request-ID", id);

  next();
};
