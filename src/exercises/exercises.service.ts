import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ExercisesRepository } from './exercises.repository';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { Exercise } from './entities/exercise.entity';
import { Role } from '../auth/enums/role.enum';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { PaginationService } from '../common/pagination.service';

@Injectable()
export class ExercisesService {
  constructor(
    private readonly repository: ExercisesRepository,
    private readonly paginationService: PaginationService,
  ) {}

  create(
    createExerciseDto: CreateExerciseDto,
    userId: string,
    isAdmin: boolean,
  ): Promise<Exercise> {
    // If admin creates it, we could potentially make it default,
    // but usually admins might want to create their own private ones too.
    // For now, let's assume normal creation is private.
    // Seeding will use a different internal method or flag.
    return this.repository.create(createExerciseDto, userId, false);
  }

  // Internal method for seeding
  async createDefault(createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    const existing = await this.repository.findByName(
      createExerciseDto.name,
      null,
      true,
    );
    if (existing) return existing;
    return this.repository.create(createExerciseDto, null, true);
  }

  async findAll(
    userId: string,
    query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<Exercise>> {
    const pagination = this.paginationService.getPaginationParams(query);
    const { data, total } = await this.repository.findAll(userId, pagination);

    return {
      data,
      meta: this.paginationService.calculateMeta(
        total,
        pagination.page,
        pagination.limit,
      ),
    };
  }

  async findOne(id: string, userId: string): Promise<Exercise> {
    const exercise = await this.repository.findById(id);
    if (!exercise) {
      throw new NotFoundException(`Exercise with id #${id} not found`);
    }

    if (!exercise.isDefault && exercise.createdBy?.toString() !== userId) {
      throw new ForbiddenException('You do not have access to this exercise');
    }

    return exercise;
  }

  async update(
    id: string,
    updateExerciseDto: UpdateExerciseDto,
    userId: string,
    roles: Role[],
  ): Promise<Exercise> {
    const exercise = await this.findOne(id, userId);
    const isAdmin = roles.includes(Role.ADMIN);

    if (exercise.isDefault && !isAdmin) {
      throw new ForbiddenException('Only admins can modify default exercises');
    }

    if (!exercise.isDefault && exercise.createdBy?.toString() !== userId) {
      throw new ForbiddenException('You can only modify your own exercises');
    }

    const updated = await this.repository.update(id, updateExerciseDto);
    if (!updated) {
      throw new NotFoundException(`Exercise with id #${id} not found`);
    }
    return updated;
  }

  async remove(id: string, userId: string, roles: Role[]): Promise<Exercise> {
    const exercise = await this.findOne(id, userId);
    const isAdmin = roles.includes(Role.ADMIN);

    if (exercise.isDefault && !isAdmin) {
      throw new ForbiddenException('Only admins can delete default exercises');
    }

    if (!exercise.isDefault && exercise.createdBy?.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own exercises');
    }

    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Exercise with id #${id} not found`);
    }
    return deleted;
  }
}
