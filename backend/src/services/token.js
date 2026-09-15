import { ApiError } from "../errors/api-error";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET ?? "";
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}
class TokenService {
    jwtSecret;
    static instance;
    constructor(jwtSecret) {
        this.jwtSecret = jwtSecret;
    }
    static getInstance() {
        if (!TokenService.instance) {
            TokenService.instance = new TokenService(JWT_SECRET);
        }
        return TokenService.instance;
    }
    generateToken(payload, expiresIn = "1d") {
        return jwt.sign(payload, this.jwtSecret, {
            expiresIn,
        });
    }
    verifyToken(token, isRefresh) {
        try {
            const data = jwt.verify(token, this.jwtSecret);
            if (typeof data.id !== "string" ||
                typeof data.roleId !== "string") {
                throw new Error("Invalid token payload");
            }
            return {
                id: data.id,
                roleId: data.roleId,
            };
        }
        catch {
            throw new ApiError({
                code: isRefresh ? "FORBIDDEN" : "UNAUTHORIZED",
                message: "Invalid or expired access token. Please sign in again.",
                details: isRefresh
                    ? "Refresh token verification failed."
                    : "Access token verification failed.",
            });
        }
    }
}
export const tokenService = TokenService.getInstance();
