import { Test, TestingModule } from '@nestjs/testing';
import {
  ExecutionContext,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { WorkoutOwnershipGuard } from './workout-ownership.guard';
import { WorkoutsService } from '../../workouts/workouts.service';
import { Role } from '../enums/role.enum';
import { Types } from 'mongoose';

describe('WorkoutOwnershipGuard', () => {
  let guard: WorkoutOwnershipGuard;
  let workoutsService: WorkoutsService;

  const mockWorkoutsService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkoutOwnershipGuard,
        {
          provide: WorkoutsService,
          useValue: mockWorkoutsService,
        },
      ],
    }).compile();

    guard = module.get<WorkoutOwnershipGuard>(WorkoutOwnershipGuard);
    workoutsService = module.get<WorkoutsService>(WorkoutsService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access for admin even if workout not found (as per current logic)', async () => {
    const validId = new Types.ObjectId().toHexString();
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { id: 'admin1', roles: [Role.ADMIN] },
          params: { id: validId },
        }),
      }),
    } as unknown as ExecutionContext;

    mockWorkoutsService.findOne.mockResolvedValue(null);

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should allow access and attach workout if owner', async () => {
    const validId = new Types.ObjectId().toHexString();
    const mockWorkout = { id: validId, name: 'Test Workout' };
    const request = {
      user: { id: 'user1', roles: [Role.USER] },
      params: { id: validId },
      workout: undefined,
    };
    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;

    mockWorkoutsService.findOne.mockResolvedValue(mockWorkout);

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
    expect(request.workout).toBe(mockWorkout);
  });

  it('should throw NotFoundException if workout not found for user', async () => {
    const validId = new Types.ObjectId().toHexString();
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { id: 'user1', roles: [Role.USER] },
          params: { id: validId },
        }),
      }),
    } as unknown as ExecutionContext;

    mockWorkoutsService.findOne.mockResolvedValue(null);

    await expect(guard.canActivate(context)).rejects.toThrow(NotFoundException);
  });
});
