import { tryCatch } from "../../errors/try-catch";
import { AuthService } from "./service";
export const AuthController = {
    verifyToken: tryCatch(async (req, res) => {
        const authHeader = req.headers["authorization"];
        const data = await AuthService.verifyToken(authHeader);
        res.status(200).json({
            data,
            message: "Token is valid",
        });
    }),
    signup: tryCatch(async (req, res) => {
        const { accessToken, refreshToken } = await AuthService.signup(req.body);
        res.status(201).json({
            data: { accessToken, refreshToken },
            message: "Sign Up successfully",
        });
    }),
    signin: tryCatch(async (req, res) => {
        const { accessToken, refreshToken } = await AuthService.signin(req.body);
        res.status(200).json({
            data: { accessToken, refreshToken },
            message: "Sign In successfully",
        });
    }),
    refresh: tryCatch(async (req, res) => {
        const { accessToken } = await AuthService.refreshToken(req.headers["authorization"]);
        res.status(200).json({
            data: { accessToken },
            message: "Token refreshed successfully",
        });
    }),
    signOut: tryCatch(async (req, res) => {
        await AuthService.signOut(req.headers["authorization"]);
        res.status(200).json({ message: "Sign Out successfully" });
    }),
};
