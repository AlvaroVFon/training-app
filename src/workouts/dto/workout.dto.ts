import { ApiProperty } from '@nestjs/swagger';

export class WorkoutSetDto {
  @ApiProperty({ example: 10 })
  reps: number;

  @ApiProperty({ example: 60 })
  weight: number;

  @ApiProperty({ example: 90, required: false })
  restTime?: number;

  @ApiProperty({ example: 'Easy set', required: false })
  notes?: string;
}

export class WorkoutExerciseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  exerciseId: string;

  @ApiProperty({ example: 'Bench Press' })
  exerciseName: string;

  @ApiProperty({ type: [WorkoutSetDto] })
  sets: WorkoutSetDto[];

  @ApiProperty({ example: 'Focus on form', required: false })
  notes?: string;
}

export class WorkoutDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({ example: 'Monday Chest Day' })
  name: string;

  @ApiProperty({ example: '2024-03-20T10:00:00.000Z' })
  date: Date;

  @ApiProperty({ type: [WorkoutExerciseDto] })
  exercises: WorkoutExerciseDto[];

  @ApiProperty({ example: 'Great workout today', required: false })
  notes?: string;

  @ApiProperty({ example: '2024-03-20T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-03-20T10:00:00.000Z' })
  updatedAt: Date;
}
