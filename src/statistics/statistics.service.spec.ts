import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsService } from './statistics.service';
import { StatisticsRepository } from './statistics.repository';
import { UserMetric } from './entities/user-metrics.entity';

describe('StatisticsService', () => {
  let service: StatisticsService;
  let repository: StatisticsRepository;

  const mockStatisticsRepository = {
    getSummary: jest.fn(),
    getMuscleDistribution: jest.fn(),
    getExerciseProgress: jest.fn(),
    getUserMetrics: jest.fn(),
    createMetric: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsService,
        {
          provide: StatisticsRepository,
          useValue: mockStatisticsRepository,
        },
      ],
    }).compile();

    service = module.get<StatisticsService>(StatisticsService);
    repository = module.get<StatisticsRepository>(StatisticsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call getSummary on repository', async () => {
    const userId = 'user123';
    const dateRange = { startDate: '2023-01-01', endDate: '2023-12-31' };
    const mockSummary = {
      totalWorkouts: 10,
      totalVolume: 1000,
      totalReps: 100,
      workoutsThisMonth: 2,
    };
    mockStatisticsRepository.getSummary.mockResolvedValue(mockSummary);

    const result = await service.getSummary(userId, dateRange);

    expect(repository.getSummary).toHaveBeenCalledWith(userId, dateRange);
    expect(result).toEqual(mockSummary);
  });

  it('should call getMuscleDistribution on repository', async () => {
    const userId = 'user123';
    const dateRange = {};
    const mockDistribution = [
      { muscleGroup: 'chest', setsCount: 10, percentage: 100 },
    ];
    mockStatisticsRepository.getMuscleDistribution.mockResolvedValue(
      mockDistribution,
    );

    const result = await service.getMuscleDistribution(userId, dateRange);

    expect(repository.getMuscleDistribution).toHaveBeenCalledWith(
      userId,
      dateRange,
    );
    expect(result).toEqual(mockDistribution);
  });

  it('should call getExerciseProgress on repository', async () => {
    const userId = 'user123';
    const exerciseId = 'ex123';
    const dateRange = { startDate: '2023-01-01' };
    const mockProgress = [
      { date: new Date(), oneRepMax: 100, volume: 1000, maxWeight: 80 },
    ];
    mockStatisticsRepository.getExerciseProgress.mockResolvedValue(
      mockProgress,
    );

    const result = await service.getExerciseProgress(
      userId,
      exerciseId,
      dateRange,
    );

    expect(repository.getExerciseProgress).toHaveBeenCalledWith(
      userId,
      exerciseId,
      dateRange,
    );
    expect(result).toEqual(mockProgress);
  });

  it('should call getUserMetrics on repository', async () => {
    const userId = 'user123';
    const dateRange = { startDate: '2023-01-01' };
    const mockMetrics = [{ weight: 80, height: 180 } as UserMetric];
    mockStatisticsRepository.getUserMetrics.mockResolvedValue(mockMetrics);

    const result = await service.getMetrics(userId, dateRange);

    expect(repository.getUserMetrics).toHaveBeenCalledWith(userId, dateRange);
    expect(result).toEqual(mockMetrics);
  });

  it('should call createMetric on repository', async () => {
    const userId = 'user123';
    const metricData = { weight: 80 };
    const mockMetric = { ...metricData, userId } as any;
    mockStatisticsRepository.createMetric.mockResolvedValue(mockMetric);

    const result = await service.addMetric(userId, metricData);

    expect(repository.createMetric).toHaveBeenCalledWith(userId, metricData);
    expect(result).toEqual(mockMetric);
  });
});
