import { CustomError } from "./CustomError.js";

export class ConflictError extends CustomError {
  private static readonly _statusCode = 409;

  private readonly _statusCode: number;
  private readonly _context: Record<string, unknown>;

  constructor(params?: {
    message?: string;
    context?: Record<string, unknown>;
  }) {
    const { message } = params || {};

    super(message || "Conflict");

    this._statusCode = ConflictError._statusCode;
    this._context = params?.context ?? {};

    Object.setPrototypeOf(this, ConflictError.prototype);
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
