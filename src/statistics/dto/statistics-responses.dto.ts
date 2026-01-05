import { ApiProperty } from '@nestjs/swagger';

export class StatisticsSummaryDto {
  @ApiProperty({ example: 42 })
  totalWorkouts: number;

  @ApiProperty({ example: 150000 })
  totalVolume: number;

  @ApiProperty({ example: 1200 })
  totalReps: number;

  @ApiProperty({ example: 5 })
  workoutsThisMonth: number;
}

export class MuscleDistributionDto {
  @ApiProperty({ example: 'chest' })
  muscleGroup: string;

  @ApiProperty({ example: 45 })
  setsCount: number;

  @ApiProperty({ example: 25.5 })
  percentage: number;
}

export class ExerciseProgressDto {
  @ApiProperty({ example: '2024-01-01' })
  date: Date;

  @ApiProperty({ example: 100 })
  oneRepMax: number;

  @ApiProperty({ example: 5000 })
  volume: number;

  @ApiProperty({ example: 120 })
  maxWeight: number;
}
