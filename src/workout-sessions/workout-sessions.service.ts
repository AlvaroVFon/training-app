import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkoutSessionsRepository } from './workout-sessions.repository';
import { CreateWorkoutSessionDto } from './dto/create-workout-session.dto';
import { UpdateWorkoutSessionDto } from './dto/update-workout-session.dto';
import {
  WorkoutSessionDto,
  SessionExerciseDto,
  SessionSetDto,
} from './dto/workout-session.dto';
import { WorkoutSession } from './entities/workout-session.entity';
import { Exercise } from '../exercises/entities/exercise.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { PaginationService } from '../common/pagination.service';
import { SessionStatus } from './enums/session-status.enum';

@Injectable()
export class WorkoutSessionsService {
  constructor(
    private readonly repository: WorkoutSessionsRepository,
    private readonly paginationService: PaginationService,
  ) {}

  async create(
    createDto: CreateWorkoutSessionDto,
    userId: string,
  ): Promise<WorkoutSessionDto> {
    const session = await this.repository.create(createDto, userId);
    return this.mapToDto(session);
  }

  async findAll(
    userId: string,
    query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<WorkoutSessionDto>> {
    const pagination = this.paginationService.getPaginationParams(query);
    const { data, total } = await this.repository.findAll(userId, {
      ...query,
      ...pagination,
    });

    return {
      data: data.map((s) => this.mapToDto(s)),
      meta: this.paginationService.calculateMeta(
        total,
        pagination.page,
        pagination.limit,
      ),
    };
  }

  async findOne(id: string, userId: string): Promise<WorkoutSessionDto> {
    const session = await this.repository.findOne(id, userId);
    if (!session) {
      throw new NotFoundException(`Workout Session with ID ${id} not found`);
    }
    return this.mapToDto(session);
  }

  async update(
    id: string,
    updateDto: UpdateWorkoutSessionDto,
    userId: string,
  ): Promise<WorkoutSessionDto> {
    // Check if it exists and owner
    const existing = await this.repository.findOne(id, userId);
    if (!existing) {
      throw new NotFoundException(`Workout Session with ID ${id} not found`);
    }

    const session = await this.repository.update(id, updateDto, userId);
    return this.mapToDto(session!);
  }

  async remove(id: string, userId: string): Promise<WorkoutSessionDto> {
    const session = await this.repository.remove(id, userId);
    if (!session) {
      throw new NotFoundException(`Workout Session with ID ${id} not found`);
    }
    return this.mapToDto(session);
  }

  async close(id: string, userId: string): Promise<WorkoutSessionDto> {
    const session = await this.repository.update(
      id,
      { status: SessionStatus.CLOSED, endDate: new Date().toISOString() },
      userId,
    );
    if (!session) {
      throw new NotFoundException(`Workout Session with ID ${id} not found`);
    }
    return this.mapToDto(session);
  }

  private mapToDto(session: WorkoutSession): WorkoutSessionDto {
    return {
      id: (session._id as any).toString(),
      name: session.name,
      workoutTemplateId: session.workoutTemplate
        ? (session.workoutTemplate as any).toString()
        : undefined,
      startDate: session.startDate,
      endDate: session.endDate,
      status: session.status,
      notes: session.notes,
      createdAt: (session as any).createdAt,
      updatedAt: (session as any).updatedAt,
      exercises: session.exercises.map((se): SessionExerciseDto => {
        const exercise = se.exercise as Exercise;
        return {
          exerciseId: (exercise._id || exercise).toString(),
          exerciseName: exercise.name || 'Unknown Exercise',
          notes: se.notes,
          sets: se.sets.map(
            (set): SessionSetDto => ({
              reps: set.reps,
              weight: set.weight,
              restTime: set.restTime,
              notes: set.notes,
            }),
          ),
        };
      }),
    };
  }
}
