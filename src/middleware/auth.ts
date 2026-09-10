import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/api-error";
import { tokenService } from "../services/token";
import { redisService } from "../services/redis";

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"] as string ;
  if (!authHeader) {
  throw new ApiError({
    code: "UNAUTHORIZED",
    message: "Authentication required",
    details: "Authorization header is missing.",
  });
}
  // const userId = req.headers["x-user-id"] as string;
  // const userRole = req.headers["x-user-role"] as string;


  const parts = authHeader.trim().split(/\s+/);

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    throw new ApiError({
      code: "UNAUTHORIZED",
      message: "Invalid Authorization format",
      details: "Expected format: Bearer <token>",
    });
  }

  const token = parts[1] as string;

  const payload = tokenService.verifyToken(token, false);
   const redis = redisService.getClient();

  const key = `blacklist:${token}`;
  const isBlacklisted = await redis.get(key);

  if (isBlacklisted) {
    throw new ApiError({
      code: "UNAUTHORIZED",
      message: "Token revoked",
      details: "This token has been revoked. Please sign in again.",
    });
  }

  req.user = {
    id: payload.id,
    roleId: payload.roleId,
  };

  req.token = token;
  //  if (userId && userRole) {
  //   req.user = { id: userId, roleId: userRole };
  // }

  // if (authHeader) {
  //   req.token = authHeader;
  // }

  next();
};