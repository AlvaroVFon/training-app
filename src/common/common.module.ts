import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PaginationService } from './pagination.service';
import { INJECT_HTTP_LOGGER } from './logger/http-logger.interface';
import { WinstonHttpLogger } from './logger/winston-http-logger';
import { HttpLoggerInterceptor } from './logger/http-logger.interceptor';

@Global()
@Module({
  providers: [
    PaginationService,
    {
      provide: INJECT_HTTP_LOGGER,
      useClass: WinstonHttpLogger,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggerInterceptor,
    },
  ],
  exports: [PaginationService, INJECT_HTTP_LOGGER],
})
export class CommonModule {}
