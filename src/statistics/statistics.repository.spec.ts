import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { StatisticsRepository } from './statistics.repository';
import { WorkoutSession } from '../workout-sessions/entities/workout-session.entity';
import { Exercise } from '../exercises/entities/exercise.entity';
import { UserMetric } from './entities/user-metrics.entity';

describe('StatisticsRepository', () => {
  let repository: StatisticsRepository;
  let sessionModel: any;
  let userMetricModel: any;

  const mockSessionModel = {
    aggregate: jest.fn(),
  };

  const mockExerciseModel = {};

  const mockUserMetricModel = {
    find: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    exec: jest.fn(),
    save: jest.fn(),
  };

  // Helper factory to simulate Mongoose document instantiation
  function MockMetricModel(dto: any) {
    this.data = dto;
    this.save = mockUserMetricModel.save;
  }

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsRepository,
        {
          provide: getModelToken(WorkoutSession.name),
          useValue: mockSessionModel,
        },
        {
          provide: getModelToken(Exercise.name),
          useValue: mockExerciseModel,
        },
        {
          provide: getModelToken(UserMetric.name),
          // We use a combination of the constructor function and the mock object for find/exec
          useValue: Object.assign(MockMetricModel, mockUserMetricModel),
        },
      ],
    }).compile();

    repository = module.get<StatisticsRepository>(StatisticsRepository);
    sessionModel = module.get(getModelToken(WorkoutSession.name));
    userMetricModel = module.get(getModelToken(UserMetric.name));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getSummary', () => {
    it('should call aggregate with correct pipeline including date filter', async () => {
      const userId = new Types.ObjectId().toHexString();
      const dateRange = { startDate: '2023-01-01', endDate: '2023-12-31' };
      mockSessionModel.aggregate.mockResolvedValue([
        {
          totals: [{ totalWorkouts: 5, totalVolume: 5000, totalReps: 500 }],
          thisMonth: [{ count: 2 }],
        },
      ]);

      const result = await repository.getSummary(userId, dateRange);

      expect(sessionModel.aggregate).toHaveBeenCalled();
      const pipeline = sessionModel.aggregate.mock.calls[0][0];

      // Check first stage is $match with user and date
      expect(pipeline[0].$match.user).toEqual(new Types.ObjectId(userId));
      expect(pipeline[0].$match.startDate.$gte).toBeInstanceOf(Date);
      expect(pipeline[0].$match.startDate.$lte).toBeInstanceOf(Date);

      expect(result.totalWorkouts).toBe(5);
      expect(result.workoutsThisMonth).toBe(2);
    });

    it('should handle empty results', async () => {
      const userId = new Types.ObjectId().toHexString();
      mockSessionModel.aggregate.mockResolvedValue([
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
      mockSessionModel.aggregate.mockResolvedValue(mockResult);

      const result = await repository.getMuscleDistribution(userId, {});

      expect(sessionModel.aggregate).toHaveBeenCalled();
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
      mockSessionModel.aggregate.mockResolvedValue(mockResult);

      const result = await repository.getExerciseProgress(
        userId,
        exerciseId,
        {},
      );

      expect(sessionModel.aggregate).toHaveBeenCalled();
      const pipeline = sessionModel.aggregate.mock.calls[0][0];
      expect(pipeline[0].$match.user).toEqual(new Types.ObjectId(userId));
      expect(pipeline[0].$match['exercises.exercise']).toEqual(
        new Types.ObjectId(exerciseId),
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('getUserMetrics', () => {
    it('should call find with correct filter and sorted by measuredAt', async () => {
      const userId = new Types.ObjectId().toHexString();
      const dateRange = { startDate: '2023-01-01', endDate: '2023-12-31' };
      const mockResult = [{ weight: 80, measuredAt: new Date() }];
      mockUserMetricModel.exec.mockResolvedValue(mockResult);

      const result = await repository.getUserMetrics(userId, dateRange);

      expect(userMetricModel.find).toHaveBeenCalledWith({
        userId: new Types.ObjectId(userId),
        measuredAt: {
          $gte: expect.any(Date),
          $lte: expect.any(Date),
        },
      });
      expect(userMetricModel.sort).toHaveBeenCalledWith({ measuredAt: 1 });
      expect(result).toEqual(mockResult);
    });
  });

  describe('createMetric', () => {
    it('should save a new metric', async () => {
      const userId = new Types.ObjectId().toHexString();
      const metricData = { weight: 80, height: 180 };
      const savedMetric = { ...metricData, userId: new Types.ObjectId(userId) };
      mockUserMetricModel.save.mockResolvedValue(savedMetric);

      const result = await repository.createMetric(userId, metricData);

      expect(mockUserMetricModel.save).toHaveBeenCalled();
      expect(result).toEqual(savedMetric);
    });
  });
});
