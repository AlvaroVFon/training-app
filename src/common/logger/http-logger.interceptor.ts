import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { HttpLoggerInterface } from './http-logger.interface';
import { INJECT_HTTP_LOGGER } from './http-logger.interface';

@Injectable()
export class HttpLoggerInterceptor implements NestInterceptor {
  constructor(
    @Inject(INJECT_HTTP_LOGGER) private httpLogger: HttpLoggerInterface,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const startTime = Date.now();
    const timestamp = new Date();
    const { method, url, body } = request;
    const userId = request.user?.id;
    const userEmail = request.user?.email;

    this.httpLogger.logRequest({
      method,
      url,
      requestBody: body,
      userId,
      userEmail,
      timestamp,
    });

    return next.handle().pipe(
      tap((data) => {
        const duration = Date.now() - startTime;
        this.httpLogger.logResponse({
          method,
          url,
          statusCode: response.statusCode,
          duration,
          responseBody: data,
          userId,
          timestamp,
        });
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        this.httpLogger.logError({
          method,
          url,
          statusCode: error.status || 500,
          duration,
          error: error.message,
          requestBody: body,
          responseBody: error.response || error.message,
          userId,
          timestamp,
        });
        throw error;
      }),
    );
  }
}
