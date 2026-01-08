export const INJECT_HTTP_LOGGER = Symbol('INJECT_HTTP_LOGGER');

export interface HttpLogContext {
  method: string;
  url: string;
  statusCode?: number;
  duration?: number;
  error?: string;
  requestBody?: unknown;
  responseBody?: unknown;
  userId?: string;
  userEmail?: string;
  timestamp?: Date;
}

export interface HttpLoggerInterface {
  logRequest(context: HttpLogContext): void;
  logResponse(context: HttpLogContext): void;
  logError(context: HttpLogContext): void;
}
