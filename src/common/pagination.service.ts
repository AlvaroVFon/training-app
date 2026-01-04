import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { PaginationMetaDto } from './dto/paginated-response.dto';

@Injectable()
export class PaginationService {
  private readonly defaultLimit: number;
  private readonly maxLimit: number;

  constructor(private readonly configService: ConfigService) {
    this.defaultLimit =
      this.configService.get<number>('paginationDefaultLimit') || 10;
    this.maxLimit = this.configService.get<number>('paginationMaxLimit') || 100;
  }

  /**
   * Normalizes pagination parameters and returns them.
   */
  getPaginationParams(query: PaginationQueryDto): {
    page: number;
    limit: number;
  } {
    const page = Math.max(1, query.page || 1);
    let limit = query.limit || this.defaultLimit;

    if (limit > this.maxLimit) {
      limit = this.maxLimit;
    } else if (limit < 1) {
      limit = this.defaultLimit;
    }

    return { page, limit };
  }

  /**
   * Calculates pagination metadata.
   */
  calculateMeta(total: number, page: number, limit: number): PaginationMetaDto {
    const lastPage = Math.ceil(total / limit) || 1;

    return {
      total,
      page,
      lastPage,
      limit,
    };
  }
}
