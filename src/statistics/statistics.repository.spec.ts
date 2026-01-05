import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { StatisticsRepository } from './statistics.repository';
import { Workout } from '../workouts/entities/workout.entity';
import { Exercise } from '../exercises/entities/exercise.entity';

describe('StatisticsRepository', () => {
  let repository: StatisticsRepository;
  let workoutModel: any;

  const mockWorkoutModel = {
    aggregate: jest.fn(),
  };

  const mockExerciseModel = {};

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsRepository,
        {
          provide: getModelToken(Workout.name),
          useValue: mockWorkoutModel,
        },
        {
          provide: getModelToken(Exercise.name),
          useValue: mockExerciseModel,
        },
      ],
    }).compile();

    repository = module.get<StatisticsRepository>(StatisticsRepository);
    workoutModel = module.get(getModelToken(Workout.name));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getSummary', () => {
    it('should call aggregate with correct pipeline including date filter', async () => {
      const userId = new Types.ObjectId().toHexString();
      const dateRange = { startDate: '2023-01-01', endDate: '2023-12-31' };
      mockWorkoutModel.aggregate.mockResolvedValue([
        {
          totals: [{ totalWorkouts: 5, totalVolume: 5000, totalReps: 500 }],
          thisMonth: [{ count: 2 }],
        },
      ]);

      const result = await repository.getSummary(userId, dateRange);

      expect(workoutModel.aggregate).toHaveBeenCalled();
      const pipeline = workoutModel.aggregate.mock.calls[0][0];

      // Check first stage is $match with user and date
      expect(pipeline[0].$match.user).toEqual(new Types.ObjectId(userId));
      expect(pipeline[0].$match.date.$gte).toBeInstanceOf(Date);
      expect(pipeline[0].$match.date.$lte).toBeInstanceOf(Date);

      expect(result.totalWorkouts).toBe(5);
      expect(result.workoutsThisMonth).toBe(2);
    });

    it('should handle empty results', async () => {
      const userId = new Types.ObjectId().toHexString();
      mockWorkoutModel.aggregate.mockResolvedValue([
        { totals: [], thisMonth: [] },
      ]);

      const result = await repository.getSummary(userId, {});

      expect(result.totalWorkouts).toBe(0);
      expect(result.totalVolume).toBe(0);
      expect(result.workoutsThisMonth).toBe(0);
    });
  });

  describe('getMuscleDistribution', () => {
    it('should call aggregate with correct pipeline', async () => {
      const userId = new Types.ObjectId().toHexString();
      const mockResult = [
        { muscleGroup: 'Chest', setsCount: 10, percentage: 100 },
      ];
      mockWorkoutModel.aggregate.mockResolvedValue(mockResult);

      const result = await repository.getMuscleDistribution(userId, {});

      expect(workoutModel.aggregate).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe('getExerciseProgress', () => {
    it('should call aggregate with correct pipeline', async () => {
      const userId = new Types.ObjectId().toHexString();
      const exerciseId = new Types.ObjectId().toHexString();
      const mockResult = [
        { date: new Date(), maxWeight: 100, volume: 1000, oneRepMax: 120 },
      ];
      mockWorkoutModel.aggregate.mockResolvedValue(mockResult);

      const result = await repository.getExerciseProgress(
        userId,
        exerciseId,
        {},
      );

      expect(workoutModel.aggregate).toHaveBeenCalled();
      const pipeline = workoutModel.aggregate.mock.calls[0][0];
      expect(pipeline[0].$match.user).toEqual(new Types.ObjectId(userId));
      expect(pipeline[0].$match['exercises.exercise']).toEqual(
        new Types.ObjectId(exerciseId),
      );
      expect(result).toEqual(mockResult);
    });
  });
});
