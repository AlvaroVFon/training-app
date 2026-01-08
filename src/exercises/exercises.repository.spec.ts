import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ExercisesRepository } from './exercises.repository';
import { Exercise } from './entities/exercise.entity';
import { MuscleGroup } from '../muscle-groups/enums/muscle-group.enum';

describe('ExercisesRepository', () => {
  let repository: ExercisesRepository;

  const mockExercise = {
    _id: new Types.ObjectId(),
    name: 'Test Exercise',
    description: 'Test Description',
    muscleGroup: MuscleGroup.CHEST,
    isDefault: true,
  };

  const mockExerciseModel = {
    create: jest.fn(),
    find: jest.fn().mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    }),
    findOne: jest.fn().mockReturnValue({
      exec: jest.fn(),
    }),
    findById: jest.fn().mockReturnValue({
      exec: jest.fn(),
    }),
    findByIdAndUpdate: jest.fn().mockReturnValue({
      exec: jest.fn(),
    }),
    findByIdAndDelete: jest.fn().mockReturnValue({
      exec: jest.fn(),
    }),
    countDocuments: jest.fn().mockReturnValue({
      exec: jest.fn(),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExercisesRepository,
        {
          provide: getModelToken(Exercise.name),
          useValue: mockExerciseModel,
        },
      ],
    }).compile();

    repository = module.get<ExercisesRepository>(ExercisesRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated exercises', async () => {
      const userId = new Types.ObjectId().toHexString();
      const exercises = [mockExercise];
      mockExerciseModel.find.mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(exercises),
          }),
        }),
      } as any);
      mockExerciseModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      } as any);

      const result = await repository.findAll(userId, { page: 1, limit: 10 });

      expect(result.data).toEqual(exercises);
      expect(result.total).toBe(1);
      expect(mockExerciseModel.find).toHaveBeenCalledWith({
        $and: [
          {
            $or: [
              { isDefault: true },
              { createdBy: new Types.ObjectId(userId) },
            ],
          },
        ],
      });
    });

    it('should return filtered exercises when search is provided', async () => {
      const userId = new Types.ObjectId().toHexString();
      const exercises = [mockExercise];
      const search = 'push';
      mockExerciseModel.find.mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(exercises),
          }),
        }),
      } as any);
      mockExerciseModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      } as any);

      await repository.findAll(userId, { page: 1, limit: 10, search });

      expect(mockExerciseModel.find).toHaveBeenCalledWith({
        $and: [
          {
            $or: [
              { isDefault: true },
              { createdBy: new Types.ObjectId(userId) },
            ],
          },
          {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { description: { $regex: search, $options: 'i' } },
            ],
          },
        ],
      });
    });

    it('should filter by muscleGroup if provided', async () => {
      const userId = new Types.ObjectId().toHexString();
      const muscleGroup = MuscleGroup.BACK;
      mockExerciseModel.find.mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([]),
          }),
        }),
      } as any);
      mockExerciseModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(0),
      } as any);

      await repository.findAll(userId, { page: 1, limit: 10, muscleGroup });

      expect(mockExerciseModel.find).toHaveBeenCalledWith({
        $and: [
          {
            $or: [
              { isDefault: true },
              { createdBy: new Types.ObjectId(userId) },
            ],
          },
          { muscleGroup },
        ],
      });
    });
  });
});
