import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { WorkoutsRepository } from './workouts.repository';
import { Workout } from './entities/workout.entity';

describe('WorkoutsRepository', () => {
  let repository: WorkoutsRepository;

  const mockWorkout = {
    _id: new Types.ObjectId(),
    name: 'Test Workout',
    notes: 'Test Notes',
    user: new Types.ObjectId(),
    exercises: [],
    save: jest.fn(),
  };

  const mockWorkoutModel = {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    countDocuments: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkoutsRepository,
        {
          provide: getModelToken(Workout.name),
          useValue: mockWorkoutModel,
        },
      ],
    }).compile();

    repository = module.get<WorkoutsRepository>(WorkoutsRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated workouts', async () => {
      const userId = new Types.ObjectId().toHexString();
      const workouts = [mockWorkout];
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(workouts),
      };

      mockWorkoutModel.find.mockReturnValue(mockQuery);
      mockWorkoutModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      });

      const result = await repository.findAll(userId, { page: 1, limit: 10 });

      expect(result.data).toEqual(workouts);
      expect(result.total).toBe(1);
      expect(mockWorkoutModel.find).toHaveBeenCalledWith({
        user: new Types.ObjectId(userId),
      });
    });

    it('should return filtered workouts when search is provided', async () => {
      const userId = new Types.ObjectId().toHexString();
      const workouts = [mockWorkout];
      const search = 'chest';
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(workouts),
      };

      mockWorkoutModel.find.mockReturnValue(mockQuery);
      mockWorkoutModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      });

      await repository.findAll(userId, { page: 1, limit: 10, search });

      expect(mockWorkoutModel.find).toHaveBeenCalledWith({
        user: new Types.ObjectId(userId),
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { notes: { $regex: search, $options: 'i' } },
        ],
      });
    });
  });
});
