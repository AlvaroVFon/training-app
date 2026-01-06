import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateWorkoutSessionDto } from './create-workout-session.dto';
import { IsEnum, IsOptional, IsDateString } from 'class-validator';
import { SessionStatus } from '../enums/session-status.enum';

export class UpdateWorkoutSessionDto extends PartialType(
  CreateWorkoutSessionDto,
) {
  @ApiProperty({ enum: SessionStatus, required: false })
  @IsOptional()
  @IsEnum(SessionStatus)
  status?: SessionStatus;

  @ApiProperty({ example: '2023-01-01T11:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
