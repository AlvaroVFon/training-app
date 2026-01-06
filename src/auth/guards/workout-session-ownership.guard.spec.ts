import { Test, TestingModule } from '@nestjs/testing';
import {
  ExecutionContext,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { WorkoutSessionOwnershipGuard } from './workout-session-ownership.guard';
import { WorkoutSessionsService } from '../../workout-sessions/workout-sessions.service';
import { Role } from '../enums/role.enum';
import { Types } from 'mongoose';

describe('WorkoutSessionOwnershipGuard', () => {
  let guard: WorkoutSessionOwnershipGuard;
  let sessionsService: WorkoutSessionsService;

  const mockSessionsService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkoutSessionOwnershipGuard,
        {
          provide: WorkoutSessionsService,
          useValue: mockSessionsService,
        },
      ],
    }).compile();

    guard = module.get<WorkoutSessionOwnershipGuard>(
      WorkoutSessionOwnershipGuard,
    );
    sessionsService = module.get<WorkoutSessionsService>(
      WorkoutSessionsService,
    );
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return false if user or sessionId is missing', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: null,
          params: {},
        }),
      }),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(context);
    expect(result).toBe(false);
  });

  it('should allow access for admin', async () => {
    const validId = new Types.ObjectId().toHexString();
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { id: 'admin1', roles: [Role.ADMIN] },
          params: { id: validId },
        }),
      }),
    } as unknown as ExecutionContext;

    mockSessionsService.findOne.mockResolvedValue({ id: validId });

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should allow access and attach session if owner', async () => {
    const validId = new Types.ObjectId().toHexString();
    const mockSession = { id: validId, name: 'Test Session' };
    const request = {
      user: { id: 'user1', roles: [Role.USER] },
      params: { id: validId },
      workoutSession: undefined,
    };
    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;

    mockSessionsService.findOne.mockResolvedValue(mockSession);

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
    expect(request.workoutSession).toBe(mockSession);
  });

  it('should throw NotFoundException if session not found for user', async () => {
    const validId = new Types.ObjectId().toHexString();
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { id: 'user1', roles: [Role.USER] },
          params: { id: validId },
        }),
      }),
    } as unknown as ExecutionContext;

    mockSessionsService.findOne.mockRejectedValue(new NotFoundException());

    await expect(guard.canActivate(context)).rejects.toThrow(NotFoundException);
  });
});
