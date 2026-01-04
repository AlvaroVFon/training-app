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

export class CreateWorkoutSetDto {
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

export class CreateWorkoutExerciseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsMongoId()
  exerciseId: string;

  @ApiProperty({ type: [CreateWorkoutSetDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWorkoutSetDto)
  sets: CreateWorkoutSetDto[];

  @ApiProperty({ example: 'Focus on form', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateWorkoutDto {
  @ApiProperty({ example: 'Monday Chest Day' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '2024-03-20T10:00:00.000Z', required: false })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({ type: [CreateWorkoutExerciseDto], default: [] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWorkoutExerciseDto)
  exercises: CreateWorkoutExerciseDto[];

  @ApiProperty({ example: 'Great workout today', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
