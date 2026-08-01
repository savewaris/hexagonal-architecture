export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string;
  meta?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    statusCode: number;
    details?: unknown;
  };
  timestamp: string;
}

export type ApiResponseEnvelope<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Universal Immutable Infrastructure Engine: Standardized API Response Envelope.
 * Guarantees every API endpoint returns a uniform, predictable JSON payload structure.
 */
export class ApiResponse {
  public static success<T>(data: T, meta?: Record<string, unknown>): ApiSuccessResponse<T> {
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
      ...(meta && { meta }),
    };
  }

  public static error(
    message: string,
    statusCode = 400,
    code = 'BAD_REQUEST',
    details?: unknown
  ): ApiErrorResponse {
    return {
      success: false,
      error: {
        message,
        code,
        statusCode,
        ...(details !== undefined && { details }),
      },
      timestamp: new Date().toISOString(),
    };
  }
}
