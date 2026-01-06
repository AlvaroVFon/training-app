import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { WorkoutSessionsService } from '../../workout-sessions/workout-sessions.service';
import { Role } from '../enums/role.enum';

@Injectable()
export class WorkoutSessionOwnershipGuard implements CanActivate {
  constructor(private readonly sessionsService: WorkoutSessionsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const sessionId = request.params.id;

    if (!user || !sessionId) {
      return false;
    }

    // Admin can access anything
    if (user.roles?.includes(Role.ADMIN)) {
      try {
        const session = await this.sessionsService.findOne(sessionId, user.id);
        request.workoutSession = session;
        return true;
      } catch {
        return true;
      }
    }

    try {
      const session = await this.sessionsService.findOne(sessionId, user.id);
      if (!session) {
        throw new NotFoundException(
          `Workout Session with ID ${sessionId} not found`,
        );
      }

      // Optimization: Attach session to request to avoid double fetching
      request.workoutSession = session;
      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new ForbiddenException(
        'You do not have access to this workout session',
      );
    }
  }
}
