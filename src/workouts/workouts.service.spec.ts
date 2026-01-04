import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutsService } from './workouts.service';
import { WorkoutsRepository } from './workouts.repository';
import { PaginationService } from '../common/pagination.service';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

describe('WorkoutsService', () => {
  let service: WorkoutsService;
  let repository: WorkoutsRepository;

  const mockWorkout = {
    _id: new Types.ObjectId(),
    name: 'Test Workout',
    date: new Date(),
    notes: 'Test notes',
    exercises: [
      {
        exercise: {
          _id: new Types.ObjectId(),
          name: 'Test Exercise',
        },
        sets: [{ reps: 10, weight: 50, restTime: 60, notes: 'Set 1' }],
        notes: 'Exercise notes',
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockWorkoutsRepository = {
    create: jest.fn().mockResolvedValue(mockWorkout),
    findAll: jest.fn().mockResolvedValue({ data: [mockWorkout], total: 1 }),
    findOne: jest.fn().mockResolvedValue(mockWorkout),
    update: jest.fn().mockResolvedValue(mockWorkout),
    remove: jest.fn().mockResolvedValue(mockWorkout),
  };

  const mockPaginationService = {
    getPaginationParams: jest.fn().mockReturnValue({ page: 1, limit: 10 }),
    calculateMeta: jest.fn().mockReturnValue({
      total: 1,
      page: 1,
      lastPage: 1,
      limit: 10,
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkoutsService,
        {
          provide: WorkoutsRepository,
          useValue: mockWorkoutsRepository,
        },
        {
          provide: PaginationService,
          useValue: mockPaginationService,
        },
      ],
    }).compile();

    service = module.get<WorkoutsService>(WorkoutsService);
    repository = module.get<WorkoutsRepository>(WorkoutsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a workout', async () => {
      const createDto = {
        name: 'Test Workout',
        exercises: [],
      };
      const result = await service.create(createDto as any, 'userId');
      expect(result).toBeDefined();
      expect(result.name).toBe(mockWorkout.name);
      expect(repository.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return a paginated response of workouts', async () => {
      const pagination = { page: 1, limit: 10 };
      const result = await service.findAll('userId', pagination);
      expect(result.data).toBeInstanceOf(Array);
      expect(result.data.length).toBe(1);
      expect(result.meta.total).toBe(1);
      expect(repository.findAll).toHaveBeenCalledWith('userId', pagination);
    });
  });

  describe('findOne', () => {
    it('should return a workout if found', async () => {
      const result = await service.findOne(
        mockWorkout._id.toString(),
        'userId',
      );
      expect(result).toBeDefined();
      expect(repository.findOne).toHaveBeenCalled();
    });

    it('should throw NotFoundException if not found', async () => {
      mockWorkoutsRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne('invalidId', 'userId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a workout', async () => {
      const updateDto = { name: 'Updated Name' };
      const result = await service.update(
        mockWorkout._id.toString(),
        updateDto,
        'userId',
      );
      expect(result).toBeDefined();
      expect(repository.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException if workout to update not found', async () => {
      mockWorkoutsRepository.update.mockResolvedValueOnce(null);
      await expect(service.update('invalidId', {}, 'userId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a workout', async () => {
      const result = await service.remove(mockWorkout._id.toString(), 'userId');
      expect(result).toBeDefined();
      expect(repository.remove).toHaveBeenCalled();
    });

    it('should throw NotFoundException if workout to remove not found', async () => {
      mockWorkoutsRepository.remove.mockResolvedValueOnce(null);
      await expect(service.remove('invalidId', 'userId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
