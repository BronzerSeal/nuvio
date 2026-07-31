import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/CustomError.js";

export const errorHandler = (
  err: Error & { type?: string },
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // invalid JSON
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      errors: [
        {
          message: "Invalid JSON",
        },
      ],
    });
  }

  // Handled errors
  if (err instanceof CustomError) {
    console.error(
      JSON.stringify(
        {
          statusCode: err.statusCode,
          errors: err.errors,
          stack: err.stack,
        },
        null,
        2,
      ),
    );

    return res.status(err.statusCode).json({
      errors: err.errors,
    });
  }

  // Unhandled errors
  console.error(err);

  return res.status(500).json({
    errors: [
      {
        message: "Something went wrong",
      },
    ],
  });
};
