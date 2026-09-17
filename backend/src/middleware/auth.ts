import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/api-error";
import { tokenService } from "../services/token";
import { redisService } from "../services/redis";
import { prisma } from "../services/prisma";
import { getBearerToken } from "../services/auth-header";

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"] as string;
  const token = getBearerToken(authHeader);

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

  next();
};

let adminRoleId: string | null = null;

const getAdminRoleId = async () => {
  if (adminRoleId) {
    return adminRoleId;
  }

  const role = await prisma.role.findUnique({
    where: { name: "ADMIN" },
    select: { id: true },
  });

  if (!role) {
    throw new ApiError({
      code: "INTERNAL_SERVER_ERROR",
      message: "ADMIN role not configured",
    });
  }

  adminRoleId = role.id;
  return adminRoleId;
};

// export const requireAdmin = async (
//   req: Request,
//   _res: Response,
//   next: NextFunction,
// ) => {
//   if (!req.user) {
//     throw new ApiError({
//       code: "UNAUTHORIZED",
//       message: "Authentication required",
//     });
//   }

//   const adminRole = await prisma.role.findUnique({
//     where: { name: "ADMIN" },
//   });

//   if (!adminRole || req.user.roleId !== adminRole.id) {
//     throw new ApiError({
//       code: "FORBIDDEN",
//       message: "Access denied",
//       details: "Administrator privileges are required.",
//     });
//   }

//   next();
// };

export const requireAdmin = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    throw new ApiError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }

  const adminRoleId = await getAdminRoleId();

  if (req.user.roleId !== adminRoleId) {
    throw new ApiError({
      code: "FORBIDDEN",
      message: "Access denied",
      details: "Administrator privileges are required.",
    });
  }

  next();
};
