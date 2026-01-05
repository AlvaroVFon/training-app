import { Test, TestingModule } from '@nestjs/testing';
import {
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { UserIsSelfGuard } from './user-is-self.guard';
import { Role } from '../enums/role.enum';
import { Types } from 'mongoose';

describe('UserIsSelfGuard', () => {
  let guard: UserIsSelfGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserIsSelfGuard],
    }).compile();

    guard = module.get<UserIsSelfGuard>(UserIsSelfGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access if user is admin', async () => {
    const validId = new Types.ObjectId().toHexString();
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { id: 'admin1', roles: [Role.ADMIN] },
          params: { id: validId },
        }),
      }),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should allow access if user is self', async () => {
    const validId = new Types.ObjectId().toHexString();
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { id: validId, roles: [Role.USER] },
          params: { id: validId },
        }),
      }),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should throw ForbiddenException if user is not self and not admin', async () => {
    const validId = new Types.ObjectId().toHexString();
    const otherId = new Types.ObjectId().toHexString();
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { id: validId, roles: [Role.USER] },
          params: { id: otherId },
        }),
      }),
    } as unknown as ExecutionContext;

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
