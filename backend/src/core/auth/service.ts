import {  validateObject } from "../../errors/validate-object";
import type { User } from "../../modules/auth/auth.types";
import {  AuthRepo } from "./repo";
import { ApiError } from "../../errors/api-error";
import { hash } from "../../services/hash";
import { tokenService } from "../../services/token";
import { redisService } from "../../services/redis";
import jwt from "jsonwebtoken";

export const AuthService = {


   verifyToken: async (authHeader: string | undefined) => {
    if (!authHeader) {
      throw new ApiError({
        code: "UNAUTHORIZED",
        message: "Token missing",
        details: "Please provide a valid token in the Authorization header.",
      });
    }

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

    if (!payload ) {
      throw new ApiError({
        code: "UNAUTHORIZED",
        message: "Invalid token",
        details: "The token provided is invalid or has expired.",
      });
    }

    const user = await AuthRepo.readById(payload.id);

    if (!user) {
      throw new ApiError({
        code: "NOT_FOUND",
        message: "User not found",
        details: "The user associated with this token does not exist.",
      });
    }

    const {...data } = user;

    return {
      user: {
        id: data.id,
        roleId: data.roleId,
      }
    };
  },

  signup: async (data: User.signup) => {
    const existingUser = await AuthRepo.readByEmail(data.email);
    if (existingUser) {
      throw new ApiError({
        code: "CONFLICT",
        message: "Email already in use",
        details:
          "The email provided is already associated with an existing account.",
      });
    }

    const role = await AuthRepo.findRoleByName("USER");

    if (!role) {
        throw new Error("Default USER role not found");
    }

    const hashedPassword = await hash.hashPassword(data.password);

    const user = await AuthRepo.signup({ ...data, password: hashedPassword ,roleId: role.id});
    const payload = {
      id: user.id,
      roleId: user.roleId,
    };

    return {
      accessToken: tokenService.generateToken(payload, "15m"),
      refreshToken: tokenService.generateToken(payload, "30d"),
    };
  },




  signin: async (data: User.signin) => {
    const user = await AuthRepo.readByEmail(data.email);
    if (!user || user.password == null) {
      throw new ApiError({
        code: "NOT_FOUND",
        message: "No user with this email or no password",
        details: "The email provided does not match any user in our records.",
      });
    }
    const isPasswordValid = await hash.comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new ApiError({
        code: "BAD_REQUEST",
        message: "Invalid password",
        details: "The password provided is incorrect. Please try again.",
      });
    }

      const payload = {
      id: user.id,
      roleId: user.roleId,
    };

    return {
      accessToken: tokenService.generateToken(payload, "15m"),
      refreshToken: tokenService.generateToken(payload, "7d"),
    };
  },

  
  refreshToken: async (authHeader: string | undefined) => {
    if (!authHeader) {
      throw new ApiError({
        code: "UNAUTHORIZED",
        message: "Refresh token missing",
        details: "Please provide a valid refresh token in the Authorization header.",
      });
    }

    const parts = authHeader.trim().split(/\s+/);
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new ApiError({
        code: "UNAUTHORIZED",
        message: "Invalid Authorization format",
        details: "Expected format: Bearer <token>",
      });
    }

    const token = parts[1] as string;
    const payload = tokenService.verifyToken(token, true);

    if (!payload) {
      throw new ApiError({
        code: "UNAUTHORIZED",
        message: "Invalid refresh token",
        details: "The refresh token provided is invalid or has expired.",
      });
    }

    return {
      accessToken: tokenService.generateToken(
        {
          id: payload.id,
          roleId: payload.roleId,
        },
        "15m",
      ),
    };
  },

  signOut: async (authHeader: string | undefined) => {
  if (!authHeader) {
    throw new ApiError({
      code: "UNAUTHORIZED",
      message: "Token missing",
      details:
        "Please provide a valid token in the Authorization header.",
    });
  }

  const parts = authHeader.trim().split(/\s+/);

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    throw new ApiError({
      code: "UNAUTHORIZED",
      message: "Invalid Authorization format",
      details: "Expected format: Bearer <token>",
    });
  }

  const token = parts[1] as string;
  const decoded = jwt.decode(token) as { exp?: number } | null;
  const ttl = decoded?.exp
    ? decoded.exp - Math.floor(Date.now() / 1000)
    : 0;

  if (ttl > 0) {
    const redis = redisService.getClient();

    await redis.setEx(
      `blacklist:${token}`,
      ttl,
      "blacklisted",
    );
  }
},
};