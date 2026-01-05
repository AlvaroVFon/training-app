import { Injectable } from '@nestjs/common';
import { StatisticsRepository } from './statistics.repository';
import {
  StatisticsSummaryDto,
  MuscleDistributionDto,
  ExerciseProgressDto,
} from './dto/statistics-responses.dto';
import { DateRangeDto } from './dto/date-range.dto';

@Injectable()
export class StatisticsService {
  constructor(private readonly statisticsRepository: StatisticsRepository) {}

  /**
   * Retrieves a summary of training statistics for a user.
   * @param userId The ID of the user.
   * @param dateRange Optional date range filter.
   * @returns A summary including total workouts, volume, and reps.
   */
  async getSummary(
    userId: string,
    dateRange: DateRangeDto,
  ): Promise<StatisticsSummaryDto> {
    return this.statisticsRepository.getSummary(userId, dateRange);
  }

  /**
   * Retrieves the distribution of sets per muscle group for a user.
   * @param userId The ID of the user.
   * @param dateRange Optional date range filter.
   * @returns An array of muscle groups with their respective set counts and percentages.
   */
  async getMuscleDistribution(
    userId: string,
    dateRange: DateRangeDto,
  ): Promise<MuscleDistributionDto[]> {
    return this.statisticsRepository.getMuscleDistribution(userId, dateRange);
  }

  /**
   * Retrieves the progression of a specific exercise for a user.
   * @param userId The ID of the user.
   * @param exerciseId The ID of the exercise.
   * @param dateRange Optional date range filter.
   * @returns An array of progress data points (1RM, volume, max weight) over time.
   */
  async getExerciseProgress(
    userId: string,
    exerciseId: string,
    dateRange: DateRangeDto,
  ): Promise<ExerciseProgressDto[]> {
    return this.statisticsRepository.getExerciseProgress(
      userId,
      exerciseId,
      dateRange,
    );
  }
}
