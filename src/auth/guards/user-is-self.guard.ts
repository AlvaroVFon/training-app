import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Role } from '../enums/role.enum';

@Injectable()
export class UserIsSelfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const targetId = request.params.userId || request.params.id;

    if (!user) {
      return false;
    }

    // If no targetId is provided in params, we assume the user is accessing their own data
    if (!targetId) {
      return true;
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
