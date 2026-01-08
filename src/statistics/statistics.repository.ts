import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { WorkoutSession } from '../workout-sessions/entities/workout-session.entity';
import { Exercise } from '../exercises/entities/exercise.entity';
import {
  StatisticsSummaryDto,
  MuscleDistributionDto,
  ExerciseProgressDto,
} from './dto/statistics-responses.dto';
import { DateRangeDto } from './dto/date-range.dto';
import { UserMetric } from './entities/user-metrics.entity';

interface AggregationSummary {
  totals: {
    totalWorkouts: number;
    totalVolume: number;
    totalReps: number;
  }[];
  thisMonth: {
    count: number;
  }[];
}

@Injectable()
export class StatisticsRepository {
  constructor(
    @InjectModel(WorkoutSession.name)
    private readonly sessionModel: Model<WorkoutSession>,
    @InjectModel(Exercise.name) private readonly exerciseModel: Model<Exercise>,
    @InjectModel(UserMetric.name)
    private readonly userMetricModel: Model<UserMetric>,
  ) {}

  /**
   * Builds a MongoDB filter object for date ranges.
   * @param dateRange The date range DTO.
   * @param field The field to apply the filter to (default is 'startDate').
   * @returns A filter object for the specified field.
   */
  private buildDateFilter(
    dateRange: DateRangeDto,
    field: string = 'startDate',
  ): Record<string, any> {
    const filter: Record<string, any> = {};
    if (dateRange.startDate || dateRange.endDate) {
      const dateQuery: Record<string, Date> = {};
      if (dateRange.startDate) {
        dateQuery.$gte = new Date(dateRange.startDate);
      }
      if (dateRange.endDate) {
        dateQuery.$lte = new Date(dateRange.endDate);
      }
      filter[field] = dateQuery;
    }
    return filter;
  }

  /**
   * Aggregates workout session data to provide a high-level summary.
   * Uses a $facet pipeline to calculate overall totals and monthly counts in a single pass.
   */
  async getSummary(
    userId: string,
    dateRange: DateRangeDto,
  ): Promise<StatisticsSummaryDto> {
    const userObjectId = new Types.ObjectId(userId);
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const dateFilter = this.buildDateFilter(dateRange);

    const result = await this.sessionModel.aggregate<AggregationSummary>([
      { $match: { user: userObjectId, ...dateFilter } },
      {
        $facet: {
          totals: [
            { $unwind: '$exercises' },
            { $unwind: '$exercises.sets' },
            {
              $group: {
                _id: null,
                totalWorkouts: { $addToSet: '$_id' },
                totalVolume: {
                  $sum: {
                    $multiply: [
                      '$exercises.sets.weight',
                      '$exercises.sets.reps',
                    ],
                  },
                },
                totalReps: { $sum: '$exercises.sets.reps' },
              },
            },
            {
              $project: {
                totalWorkouts: { $size: '$totalWorkouts' },
                totalVolume: 1,
                totalReps: 1,
              },
            },
          ],
          thisMonth: [
            { $match: { startDate: { $gte: firstDayOfMonth } } },
            { $count: 'count' },
          ],
        },
      },
    ]);

    const totals = result[0]?.totals[0] || {
      totalWorkouts: 0,
      totalVolume: 0,
      totalReps: 0,
    };
    const thisMonthCount = result[0]?.thisMonth[0]?.count || 0;

    return {
      totalWorkouts: totals.totalWorkouts,
      totalVolume: totals.totalVolume,
      totalReps: totals.totalReps,
      workoutsThisMonth: thisMonthCount,
    };
  }

  /**
   * Calculates the distribution of sets across muscle groups.
   * Joins workouts with exercises to determine the muscle group for each set.
   */
  async getMuscleDistribution(
    userId: string,
    dateRange: DateRangeDto,
  ): Promise<MuscleDistributionDto[]> {
    const userObjectId = new Types.ObjectId(userId);
    const dateFilter = this.buildDateFilter(dateRange);

    const result = await this.sessionModel.aggregate<MuscleDistributionDto>([
      { $match: { user: userObjectId, ...dateFilter } },
      { $unwind: '$exercises' },
      {
        $lookup: {
          from: 'exercises',
          localField: 'exercises.exercise',
          foreignField: '_id',
          as: 'exerciseDetails',
        },
      },
      { $unwind: '$exerciseDetails' },
      {
        $group: {
          _id: '$exerciseDetails.muscleGroup',
          setsCount: { $sum: { $size: '$exercises.sets' } },
        },
      },
      {
        $group: {
          _id: null,
          totalSets: { $sum: '$setsCount' },
          groups: { $push: { muscleGroup: '$_id', setsCount: '$setsCount' } },
        },
      },
      { $unwind: '$groups' },
      {
        $project: {
          _id: 0,
          muscleGroup: '$groups.muscleGroup',
          setsCount: '$groups.setsCount',
          percentage: {
            $multiply: [{ $divide: ['$groups.setsCount', '$totalSets'] }, 100],
          },
        },
      },
      { $sort: { setsCount: -1 } },
    ]);

    return result;
  }
  /**
   * Tracks the progression of a specific exercise over time.
   * Calculates 1RM (using Epley formula), total volume, and max weight per session.
   */ async getExerciseProgress(
    userId: string,
    exerciseId: string,
    dateRange: DateRangeDto,
  ): Promise<ExerciseProgressDto[]> {
    const userObjectId = new Types.ObjectId(userId);
    const exerciseObjectId = new Types.ObjectId(exerciseId);
    const dateFilter = this.buildDateFilter(dateRange);

    const result = await this.sessionModel.aggregate<ExerciseProgressDto>([
      {
        $match: {
          user: userObjectId,
          'exercises.exercise': exerciseObjectId,
          ...dateFilter,
        },
      },
      { $unwind: '$exercises' },
      { $match: { 'exercises.exercise': exerciseObjectId } },
      {
        $project: {
          startDate: 1,
          sets: '$exercises.sets',
        },
      },
      { $unwind: '$sets' },
      {
        $group: {
          _id: '$startDate',
          maxWeight: { $max: '$sets.weight' },
          volume: { $sum: { $multiply: ['$sets.weight', '$sets.reps'] } },
          // Epley Formula for 1RM: weight * (1 + reps/30)
          oneRepMax: {
            $max: {
              $multiply: [
                '$sets.weight',
                { $add: [1, { $divide: ['$sets.reps', 30] }] },
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          maxWeight: 1,
          volume: 1,
          oneRepMax: { $round: ['$oneRepMax', 2] },
        },
      },
      { $sort: { date: 1 } },
    ]);

    return result;
  }

  /**
   * Retrieves user metrics (weight, height, body fat) within a date range.
   */
  async getUserMetrics(
    userId: string,
    dateRange: DateRangeDto,
  ): Promise<UserMetric[]> {
    const userObjectId = new Types.ObjectId(userId);
    const dateFilter = this.buildDateFilter(dateRange, 'measuredAt');

    return this.userMetricModel
      .find({ userId: userObjectId, ...dateFilter })
      .sort({ measuredAt: 1 })
      .exec();
  }

  /**
   * Saves a new user metric.
   */
  async createMetric(
    userId: string,
    metricData: Partial<UserMetric>,
  ): Promise<UserMetric> {
    const newMetric = new this.userMetricModel({
      ...metricData,
      userId: new Types.ObjectId(userId),
    });
    return newMetric.save();
  }
}
