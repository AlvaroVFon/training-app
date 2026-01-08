import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import { HttpLogContext, HttpLoggerInterface } from './http-logger.interface';

@Injectable()
export class WinstonHttpLogger implements HttpLoggerInterface {
  private logger: winston.Logger;

  constructor(private configService: ConfigService) {
    const logLevel = this.configService.get<string>('logLevel') || 'info';
    this.logger = winston.createLogger({
      level: logLevel,
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      defaultMeta: { service: 'http-logger' },
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ level, message, timestamp, ...meta }) => {
              const metaStr = Object.keys(meta).length
                ? JSON.stringify(meta, null, 2)
                : '';
              return `${timestamp} [${level}]: ${message} ${metaStr}`;
            }),
          ),
        }),
      ],
    });
  }

  logRequest(context: HttpLogContext): void {
    const { method, url, userId, timestamp } = context;
    this.logger.info('HTTP Request', {
      method,
      url,
      userId,
      timestamp,
    });
  }

  logResponse(context: HttpLogContext): void {
    const { method, url, statusCode, duration, userId, timestamp } = context;
    this.logger.info('HTTP Response', {
      method,
      url,
      statusCode,
      durationMs: duration,
      userId,
      timestamp,
    });
  }

  logError(context: HttpLogContext): void {
    const {
      method,
      url,
      statusCode,
      error,
      userId,
      requestBody,
      responseBody,
      duration,
      timestamp,
    } = context;
    this.logger.error('HTTP Error', {
      method,
      url,
      statusCode,
      error,
      userId,
      requestBody,
      responseBody,
      durationMs: duration,
      timestamp,
    });
  }
}
