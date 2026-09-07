import type { Request, Response } from "express";
import { tryCatch } from "../../errors/try-catch";
import { AuthService } from "./service";
import jwt from "jsonwebtoken";
import { ApiError } from "../../errors/api-error";
import { redisService } from "../../services/redis";

export const AuthController = {

     verifyToken: tryCatch(async (req: Request, res: Response) => {
          const authHeader = req.headers["authorization"] as string | undefined;

          console.log("authHeader", authHeader);

          const data = await AuthService.verifyToken(authHeader);

          console.log("data", data);

          res.status(200).json({
               data,
               message: "Token is valid",
          });
     }),


     signup: tryCatch(async (req: Request, res: Response) => {
          const { accessToken, refreshToken } = await AuthService.signup(
               req.body,
          );

          res.status(201).json({
               data: { accessToken, refreshToken },
               message: "Sign Up successfully",
          });
     }),

     
     signin: tryCatch(async (req: Request, res: Response) => {
          const { accessToken, refreshToken } = await AuthService.signin(req.body);
          res.status(200).json({
               data: { accessToken, refreshToken },
               message: "Sign In successfully",
          });
     }),


     refresh: tryCatch(async (req: Request, res: Response) => {
          const { accessToken } = await AuthService.refreshToken(
               req.headers["authorization"] as string | undefined,
          );
          res.status(200).json({
               data: { accessToken },
               message: "Token refreshed successfully",
          });
     }),
     
     signOut: tryCatch(async (req: Request, res: Response) => {
          const authHeader = req.headers["authorization"] as string | undefined;
           if (!authHeader) { throw new ApiError({ code: "UNAUTHORIZED", message: "Token missing", details: "Please provide a valid token in the Authorization header.", }); }
            const parts = authHeader.trim().split(/\s+/);
             if (parts.length !== 2 || parts[0] !== "Bearer") { 
               throw new ApiError({ code: "UNAUTHORIZED", message: "Invalid Authorization format", details: "Expected format: Bearer <token>", });
           }
            const token = parts[1] as string; 
            const decoded = jwt.decode(token) as { exp?: number } | null; 
            const ttl = decoded?.exp ? decoded.exp - Math.floor(Date.now() / 1000) : 900;
             if (ttl > 0) { 
               const redis = redisService.getClient();
                await redis.setEx( `blacklist:${token}`, ttl, "blacklisted", );
                }
                 res.status(200).json({ message: "Sign Out successfully", });
     }),
     



      

 

     
    

 
   
};


