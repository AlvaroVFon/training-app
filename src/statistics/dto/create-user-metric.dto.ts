import { IsNumber, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserMetricDto {
  @ApiPropertyOptional({ example: 80.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @ApiPropertyOptional({ example: 175 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  height?: number;

  @ApiPropertyOptional({ example: 18.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bodyFat?: number;
}
