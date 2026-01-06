import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSessionSetDto {
  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(1)
  reps: number;

  @ApiProperty({ example: 60 })
  @IsNumber()
  @Min(0)
  weight: number;

  @ApiProperty({ example: 90, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  restTime?: number;

  @ApiProperty({ example: 'Easy set', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateSessionExerciseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsMongoId()
  exerciseId: string;

  @ApiProperty({ type: [CreateSessionSetDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSessionSetDto)
  sets: CreateSessionSetDto[];

  @ApiProperty({ example: 'Focus on form', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateWorkoutSessionDto {
  @ApiProperty({ example: 'Leg Day Session' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', required: false })
  @IsOptional()
  @IsMongoId()
  workoutTemplateId?: string;

  @ApiProperty({ example: '2023-01-01T10:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ type: [CreateSessionExerciseDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSessionExerciseDto)
  exercises?: CreateSessionExerciseDto[];

  @ApiProperty({ example: 'Feeling strong today', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
