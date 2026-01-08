import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MuscleGroupsRepository } from './muscle-groups.repository';
import { MuscleGroup } from './entities/muscle-group.entity';

describe('MuscleGroupsRepository', () => {
  let repository: MuscleGroupsRepository;

  const mockMuscleGroup = {
    name: 'Chest',
    description: 'Chest muscles',
  };

  const mockMuscleGroupModel = {
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
        MuscleGroupsRepository,
        {
          provide: getModelToken(MuscleGroup.name),
          useValue: mockMuscleGroupModel,
        },
      ],
    }).compile();

    repository = module.get<MuscleGroupsRepository>(MuscleGroupsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated muscle groups', async () => {
      const muscleGroups = [mockMuscleGroup];
      mockMuscleGroupModel.find.mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(muscleGroups),
          }),
        }),
      } as any);
      mockMuscleGroupModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      } as any);

      const result = await repository.findAll({ page: 1, limit: 10 });

      expect(result.data).toEqual(muscleGroups);
      expect(result.total).toBe(1);
      expect(mockMuscleGroupModel.find).toHaveBeenCalledWith({});
    });

    it('should return filtered muscle groups when search is provided', async () => {
      const muscleGroups = [mockMuscleGroup];
      const search = 'chest';
      mockMuscleGroupModel.find.mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(muscleGroups),
          }),
        }),
      } as any);
      mockMuscleGroupModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      } as any);

      await repository.findAll({ page: 1, limit: 10, search });

      expect(mockMuscleGroupModel.find).toHaveBeenCalledWith({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      });
    });
  });
});
