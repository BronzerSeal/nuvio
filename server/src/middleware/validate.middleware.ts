import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";

import { BadRequestError } from "../errors/BadRequestError.js";

type ValidateSchemas = {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
};

export const validate =
  ({ body, query, params }: ValidateSchemas) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const validations = [
      { schema: body, key: "body" as const },
      { schema: query, key: "query" as const },
      { schema: params, key: "params" as const },
    ];

    for (const { schema, key } of validations) {
      if (!schema) continue;

      const result = schema.safeParse(req[key]);

      if (!result.success) {
        return next(
          new BadRequestError({
            message: "Validation failed",
            context: result.error.flatten(),
          }),
        );
      }

      if (key === "query") {
        Object.defineProperty(req, key, {
          value: result.data,
          writable: true,
        });
      } else {
        req[key] = result.data;
      }
    }

    next();
  };
