import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { Role } from '../enums/role.enum';

@Injectable()
export class UserIsSelfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const targetId = request.params.id;

    if (!user) {
      return false;
    }

    // Admin can access anything
    if (user.roles?.includes(Role.ADMIN)) {
      return true;
    }

    // User can only access their own data
    if (user.id === targetId) {
      return true;
    }

    throw new ForbiddenException('You can only access your own resources');
  }
}
