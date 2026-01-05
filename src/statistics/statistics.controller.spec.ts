import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserIsSelfGuard } from '../auth/guards/user-is-self.guard';
import { ExerciseOwnershipGuard } from '../auth/guards/exercise-ownership.guard';
import { ValidateObjectIdGuard } from '../auth/guards/validate-object-id.guard';
import { ExecutionContext } from '@nestjs/common';

describe('StatisticsController', () => {
  let controller: StatisticsController;
  let service: StatisticsService;

  const mockStatisticsService = {
    getSummary: jest.fn(),
    getMuscleDistribution: jest.fn(),
    getExerciseProgress: jest.fn(),
  };

  const mockGuard = {
    canActivate: jest.fn().mockReturnValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatisticsController],
      providers: [
        {
          provide: StatisticsService,
          useValue: mockStatisticsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockGuard)
      .overrideGuard(UserIsSelfGuard)
      .useValue(mockGuard)
      .overrideGuard(ExerciseOwnershipGuard)
      .useValue(mockGuard)
      .overrideGuard(ValidateObjectIdGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<StatisticsController>(StatisticsController);
    service = module.get<StatisticsService>(StatisticsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSummary', () => {
    it('should call service.getSummary with loggedInUserId if no userId provided', async () => {
      const loggedInUserId = 'user123';
      const dateRange = { startDate: '2023-01-01' };
      mockStatisticsService.getSummary.mockResolvedValue({});

      await controller.getSummary(loggedInUserId, dateRange);

      expect(service.getSummary).toHaveBeenCalledWith(
        loggedInUserId,
        dateRange,
      );
    });

    it('should call service.getSummary with provided userId', async () => {
      const loggedInUserId = 'admin123';
      const targetUserId = 'user456';
      const dateRange = {};
      mockStatisticsService.getSummary.mockResolvedValue({});

      await controller.getSummary(loggedInUserId, dateRange, targetUserId);

      expect(service.getSummary).toHaveBeenCalledWith(targetUserId, dateRange);
    });
  });

  describe('getMuscleDistribution', () => {
    it('should call service.getMuscleDistribution', async () => {
      const userId = 'user123';
      const dateRange = {};
      mockStatisticsService.getMuscleDistribution.mockResolvedValue([]);

      await controller.getMuscleDistribution(userId, dateRange);

      expect(service.getMuscleDistribution).toHaveBeenCalledWith(
        userId,
        dateRange,
      );
    });
  });

  describe('getExerciseProgress', () => {
    it('should call service.getExerciseProgress', async () => {
      const userId = 'user123';
      const exerciseId = 'ex123';
      const dateRange = {};
      mockStatisticsService.getExerciseProgress.mockResolvedValue([]);

      await controller.getExerciseProgress(userId, exerciseId, dateRange);

      expect(service.getExerciseProgress).toHaveBeenCalledWith(
        userId,
        exerciseId,
        dateRange,
      );
    });
  });
});
