import { ApiError } from "./api-error";
export const errorHandler = (error, _req, res, _next) => {
    // Known application error
    if (error instanceof ApiError) {
        return res.status(error.status).json({
            message: error.message,
            code: error.code,
            ...(error.details && { details: error.details }),
        });
    }
    // Unknown / unexpected error
    console.error("Unhandled error:", error);
    return res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
    });
};
