import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkoutsRepository } from './workouts.repository';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import {
  WorkoutDto,
  WorkoutExerciseDto,
  WorkoutSetDto,
} from './dto/workout.dto';
import { Workout } from './entities/workout.entity';
import { Exercise } from '../exercises/entities/exercise.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { PaginationService } from '../common/pagination.service';

@Injectable()
export class WorkoutsService {
  constructor(
    private readonly workoutsRepository: WorkoutsRepository,
    private readonly paginationService: PaginationService,
  ) {}

  async create(
    createWorkoutDto: CreateWorkoutDto,
    userId: string,
  ): Promise<WorkoutDto> {
    const workout = await this.workoutsRepository.create(
      createWorkoutDto,
      userId,
    );
    return this.mapToDto(workout);
  }

  async findAll(
    userId: string,
    query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<WorkoutDto>> {
    const pagination = this.paginationService.getPaginationParams(query);
    const { data, total } = await this.workoutsRepository.findAll(userId, {
      ...query,
      ...pagination,
    });

    return {
      data: data.map((w) => this.mapToDto(w)),
      meta: this.paginationService.calculateMeta(
        total,
        pagination.page,
        pagination.limit,
      ),
    };
  }

  async findOne(id: string, userId?: string): Promise<WorkoutDto> {
    const workout = await this.workoutsRepository.findOne(id, userId);
    if (!workout) {
      throw new NotFoundException(`Workout with ID ${id} not found`);
    }
    return this.mapToDto(workout);
  }

  async update(
    id: string,
    updateWorkoutDto: UpdateWorkoutDto,
    userId: string,
  ): Promise<WorkoutDto> {
    const workout = await this.workoutsRepository.update(
      id,
      updateWorkoutDto,
      userId,
    );
    if (!workout) {
      throw new NotFoundException(`Workout with ID ${id} not found`);
    }
    return this.mapToDto(workout);
  }

  async remove(id: string, userId: string): Promise<WorkoutDto> {
    const workout = await this.workoutsRepository.remove(id, userId);
    if (!workout) {
      throw new NotFoundException(`Workout with ID ${id} not found`);
    }
    return this.mapToDto(workout);
  }

  private mapToDto(workout: Workout): WorkoutDto {
    return {
      id: (workout._id as any).toString(),
      name: workout.name,
      date: workout.date,
      notes: workout.notes,
      createdAt: (workout as any).createdAt,
      updatedAt: (workout as any).updatedAt,
      exercises: workout.exercises.map((we): WorkoutExerciseDto => {
        const exercise = we.exercise as Exercise;
        return {
          exerciseId: (exercise._id as any).toString(),
          exerciseName: exercise.name,
          notes: we.notes,
          sets: we.sets.map(
            (s): WorkoutSetDto => ({
              reps: s.reps,
              weight: s.weight,
              restTime: s.restTime,
              notes: s.notes,
            }),
          ),
        };
      }),
    };
  }
}
