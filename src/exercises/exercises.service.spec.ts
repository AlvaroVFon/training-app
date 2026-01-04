import { Test, TestingModule } from '@nestjs/testing';
import { ExercisesService } from './exercises.service';
import { ExercisesRepository } from './exercises.repository';
import { MuscleGroup } from '../muscle-groups/enums/muscle-group.enum';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { Role } from '../auth/enums/role.enum';
import { Types } from 'mongoose';

describe('ExercisesService', () => {
  let service: ExercisesService;
  let repository: ExercisesRepository;

  const userId = new Types.ObjectId().toString();
  const otherUserId = new Types.ObjectId().toString();

  const mockDefaultExercise = {
    id: '1',
    name: 'Bench Press',
    muscleGroup: MuscleGroup.CHEST,
    isDefault: true,
    createdBy: null,
  };

  const mockUserExercise = {
    id: '2',
    name: 'My Exercise',
    muscleGroup: MuscleGroup.BICEPS,
    isDefault: false,
    createdBy: userId,
  };

  const mockExercisesRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExercisesService,
        {
          provide: ExercisesRepository,
          useValue: mockExercisesRepository,
        },
      ],
    }).compile();

    service = module.get<ExercisesService>(ExercisesService);
    repository = module.get<ExercisesRepository>(ExercisesRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a private exercise', async () => {
      const dto = { name: 'New Exercise', muscleGroup: MuscleGroup.CHEST };
      mockExercisesRepository.create.mockResolvedValue({
        ...dto,
        id: '3',
        createdBy: userId,
        isDefault: false,
      });

      const result = await service.create(dto, userId, false);

      expect(repository.create).toHaveBeenCalledWith(dto, userId, false);
      expect(result.name).toBe(dto.name);
    });
  });

  describe('findAll', () => {
    it('should return all accessible exercises', async () => {
      const exercises = [mockDefaultExercise, mockUserExercise];
      mockExercisesRepository.findAll.mockResolvedValue(exercises);

      const result = await service.findAll(userId);

      expect(repository.findAll).toHaveBeenCalledWith(userId);
      expect(result).toEqual(exercises);
    });
  });

  describe('findOne', () => {
    it('should return a default exercise for any user', async () => {
      mockExercisesRepository.findById.mockResolvedValue(mockDefaultExercise);

      const result = await service.findOne('1', userId);

      expect(result).toEqual(mockDefaultExercise);
    });

    it('should return a private exercise for the owner', async () => {
      mockExercisesRepository.findById.mockResolvedValue(mockUserExercise);

      const result = await service.findOne('2', userId);

      expect(result).toEqual(mockUserExercise);
    });

    it('should throw ForbiddenException if accessing other user exercise', async () => {
      mockExercisesRepository.findById.mockResolvedValue(mockUserExercise);

      await expect(service.findOne('2', otherUserId)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw NotFoundException if exercise does not exist', async () => {
      mockExercisesRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('99', userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should allow admin to update default exercise', async () => {
      const dto = { description: 'Updated' };
      mockExercisesRepository.findById.mockResolvedValue(mockDefaultExercise);
      mockExercisesRepository.update.mockResolvedValue({
        ...mockDefaultExercise,
        ...dto,
      });

      const result = await service.update('1', dto, userId, [Role.ADMIN]);

      expect(repository.update).toHaveBeenCalledWith('1', dto);
      expect(result.description).toBe('Updated');
    });

    it('should throw ForbiddenException if non-admin updates default exercise', async () => {
      mockExercisesRepository.findById.mockResolvedValue(mockDefaultExercise);

      await expect(
        service.update('1', {}, userId, [Role.USER]),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow owner to update private exercise', async () => {
      const dto = { description: 'Updated' };
      mockExercisesRepository.findById.mockResolvedValue(mockUserExercise);
      mockExercisesRepository.update.mockResolvedValue({
        ...mockUserExercise,
        ...dto,
      });

      const result = await service.update('2', dto, userId, [Role.USER]);

      expect(repository.update).toHaveBeenCalledWith('2', dto);
    });
  });

  describe('remove', () => {
    it('should allow admin to delete default exercise', async () => {
      mockExercisesRepository.findById.mockResolvedValue(mockDefaultExercise);
      mockExercisesRepository.delete.mockResolvedValue(mockDefaultExercise);

      const result = await service.remove('1', userId, [Role.ADMIN]);

      expect(repository.delete).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockDefaultExercise);
    });

    it('should throw ForbiddenException if non-admin deletes default exercise', async () => {
      mockExercisesRepository.findById.mockResolvedValue(mockDefaultExercise);

      await expect(service.remove('1', userId, [Role.USER])).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should allow owner to delete private exercise', async () => {
      mockExercisesRepository.findById.mockResolvedValue(mockUserExercise);
      mockExercisesRepository.delete.mockResolvedValue(mockUserExercise);

      const result = await service.remove('2', userId, [Role.USER]);

      expect(repository.delete).toHaveBeenCalledWith('2');
    });
  });
});
