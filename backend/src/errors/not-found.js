import { ApiError } from "./api-error";
export const notFoundHandler = (req, _res, next) => {
    next(new ApiError({
        message: `Route ${req.method} ${req.originalUrl} not found`,
        code: "NOT_FOUND",
    }));
};
