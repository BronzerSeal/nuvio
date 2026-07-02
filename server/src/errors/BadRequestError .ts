/** src/errors/BadRequestError **/

import { CustomError } from "./CustomError.js";

export class BadRequestError extends CustomError {
  private static readonly _statusCode = 400;
  private readonly _statusCode: number;
  private readonly _context: Record<string, unknown>;

  constructor(params?: {
    statusCode?: number;
    message?: string;
    context?: Record<string, unknown>;
  }) {
    const { statusCode, message } = params || {};

    super(message || "Bad request");
    this._statusCode = statusCode ?? BadRequestError._statusCode;
    this._context = params?.context ?? {};

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  get errors() {
    const error = {
      message: this.message,
    } as {
      message: string;
      context?: Record<string, unknown>;
    };

    if (Object.keys(this._context).length > 0) {
      error.context = this._context;
    }

    return [error];
  }

  get statusCode() {
    return this._statusCode;
  }
}
