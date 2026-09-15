export const codeStatus = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
    REFRESH_EXPIRED: 401,
    TOKEN_INVALID: 401,
    VALIDATION_ERROR: 422,
    UNKNOWN_ERROR: 500,
};
export class ApiError extends Error {
    status;
    code;
    details;
    constructor({ message, code, details, status, }) {
        super(message ?? code); // fallback to code as message
        this.name = "ApiError";
        this.code = code;
        this.status = status ?? codeStatus[code] ?? 500;
        this.details = details;
        Error.captureStackTrace?.(this, ApiError);
    }
}
