import type { NextFunction, Request, RequestHandler, Response } from "express";
import Joi from "joi";
import { tryCatch } from "./try-catch";
import { validateObject } from "./validate-object";

type RequestSchemas = {
  body?: Joi.ObjectSchema<any>;
  query?: Joi.ObjectSchema<any>;
  params?: Joi.ObjectSchema<any>;
};

export const validateRequestInput = ({
  body: bodySchema,
  params: paramSchema,
  query: querySchema,
}: RequestSchemas): RequestHandler =>
  tryCatch((req: Request, _res: Response, next: NextFunction) => {
    if (bodySchema) {
      req.body = validateObject(bodySchema, req.body);
    }

    if (paramSchema) {
      Object.assign(req.params, validateObject(paramSchema, req.params));
    }

    // if (querySchema) {
    //   Object.assign(req.query, validateObject(querySchema, req.query));
    // }
    // if (querySchema) {
    //   const validatedQuery = validateObject(querySchema, req.query);
    //   Object.assign(req.query, validatedQuery);
    // }
    // if (querySchema) {
    //   const validatedQuery = validateObject(querySchema, req.query);

    //   console.log("BEFORE:", req.query);
    //   console.log("AFTER:", validatedQuery);
    //   console.log("TYPE:", typeof validatedQuery.limit);

    //   Object.assign(req.query, validatedQuery);
    // }
    if (querySchema) {
      const validatedQuery = validateObject(querySchema, req.query);

      Object.defineProperty(req, "query", {
        value: validatedQuery,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    }
    next();
  });
