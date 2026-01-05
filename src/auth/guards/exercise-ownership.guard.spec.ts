import { Test, TestingModule } from '@nestjs/testing';
import {
  ExecutionContext,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { ExerciseOwnershipGuard } from './exercise-ownership.guard';
import { ExercisesService } from '../../exercises/exercises.service';
import { Role } from '../enums/role.enum';
import { Types } from 'mongoose';

describe('ExerciseOwnershipGuard', () => {
  let guard: ExerciseOwnershipGuard;
  let exercisesService: ExercisesService;

  const mockExercisesService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExerciseOwnershipGuard,
        {
          provide: ExercisesService,
          useValue: mockExercisesService,
        },
      ],
    }).compile();

    guard = module.get<ExerciseOwnershipGuard>(ExerciseOwnershipGuard);
    exercisesService = module.get<ExercisesService>(ExercisesService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access and attach exercise if owner or default', async () => {
    const validId = new Types.ObjectId().toHexString();
    const mockExercise = { id: validId, name: 'Test Exercise' };
    const request = {
      user: { id: 'user1', roles: [Role.USER] },
      params: { id: validId },
      exercise: undefined,
    };
    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;

    mockExercisesService.findOne.mockResolvedValue(mockExercise);

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
    expect(request.exercise).toBe(mockExercise);
  });

  it('should throw ForbiddenException if service throws ForbiddenException', async () => {
    const validId = new Types.ObjectId().toHexString();
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { id: 'user1', roles: [Role.USER] },
          params: { id: validId },
        }),
      }),
    } as unknown as ExecutionContext;

    mockExercisesService.findOne.mockRejectedValue(new ForbiddenException());

    await expect(guard.canActivate(context)).rejects.toThrow(
      ForbiddenException,
    );
  });
});
