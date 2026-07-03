import { CustomError } from "./CustomError.js";

export class ForbiddenError extends CustomError {
  private static readonly DEFAULT_STATUS_CODE = 403;

  private readonly _statusCode: number;
  private readonly _context: Record<string, unknown>;

  constructor(params?: {
    statusCode?: number;
    message?: string;
    context?: Record<string, unknown>;
  }) {
    const { statusCode, message } = params || {};

    super(message || "Forbidden");

    this._statusCode = statusCode ?? ForbiddenError.DEFAULT_STATUS_CODE;
    this._context = params?.context ?? {};
  }

  get errors() {
    const error: {
      message: string;
      context?: Record<string, unknown>;
    } = {
      message: this.message,
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
