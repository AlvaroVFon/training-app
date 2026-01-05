import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { WorkoutsService } from '../../workouts/workouts.service';
import { Role } from '../enums/role.enum';

@Injectable()
export class WorkoutOwnershipGuard implements CanActivate {
  constructor(private readonly workoutsService: WorkoutsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const workoutId = request.params.id;

    if (!user || !workoutId) {
      return false;
    }

    // Admin can access anything
    if (user.roles?.includes(Role.ADMIN)) {
      try {
        const workout = await this.workoutsService.findOne(workoutId);
        request.workout = workout;
        return true;
      } catch {
        return true;
      }
    }

    try {
      const workout = await this.workoutsService.findOne(workoutId, user.id);
      if (!workout) {
        throw new NotFoundException(`Workout with ID ${workoutId} not found`);
      }

      // Optimization: Attach workout to request to avoid double fetching
      request.workout = workout;
      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new ForbiddenException('You do not have access to this workout');
    }
  }
}
