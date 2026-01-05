import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { ExercisesService } from '../../exercises/exercises.service';
import { Role } from '../enums/role.enum';

@Injectable()
export class ExerciseOwnershipGuard implements CanActivate {
  constructor(private readonly exercisesService: ExercisesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const exerciseId = request.params.id;

    if (!user || !exerciseId) {
      return false;
    }

    // Admin can access anything
    if (user.roles?.includes(Role.ADMIN)) {
      try {
        const exercise = await this.exercisesService.findOne(exerciseId);
        request.exercise = exercise;
        return true;
      } catch {
        return true;
      }
    }

    try {
      const exercise = await this.exercisesService.findOne(exerciseId, user.id);

      // Optimization: Attach exercise to request to avoid double fetching
      request.exercise = exercise;
      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new ForbiddenException('You do not have access to this exercise');
    }
  }
}
