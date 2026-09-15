import Joi from "joi";
export const PaginationQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
}).options({ stripUnknown: true });
export function toSkipTake(query) {
    return { skip: (query.page - 1) * query.limit, take: query.limit };
}
export function buildPaginationMeta(total, query) {
    return {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.limit)),
    };
}
