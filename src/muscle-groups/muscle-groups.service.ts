import { Injectable, NotFoundException } from '@nestjs/common';
import { MuscleGroupsRepository } from './muscle-groups.repository';
import { CreateMuscleGroupDto } from './dto/create-muscle-group.dto';
import { UpdateMuscleGroupDto } from './dto/update-muscle-group.dto';
import { MuscleGroup } from './entities/muscle-group.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { PaginationService } from '../common/pagination.service';

@Injectable()
export class MuscleGroupsService {
  constructor(
    private readonly repository: MuscleGroupsRepository,
    private readonly paginationService: PaginationService,
  ) {}

  create(createMuscleGroupDto: CreateMuscleGroupDto): Promise<MuscleGroup> {
    return this.repository.create(createMuscleGroupDto);
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<MuscleGroup>> {
    const pagination = this.paginationService.getPaginationParams(query);
    const { data, total } = await this.repository.findAll({
      ...query,
      ...pagination,
    });

    return {
      data,
      meta: this.paginationService.calculateMeta(
        total,
        pagination.page,
        pagination.limit,
      ),
    };
  }

  async findByName(name: string): Promise<MuscleGroup | null> {
    return this.repository.findByName(name);
  }

  async findOne(id: string): Promise<MuscleGroup> {
    const muscleGroup = await this.repository.findById(id);
    if (!muscleGroup) {
      throw new NotFoundException(`Muscle group with id #${id} not found`);
    }
    return muscleGroup;
  }

  async update(
    id: string,
    updateMuscleGroupDto: UpdateMuscleGroupDto,
  ): Promise<MuscleGroup> {
    const muscleGroup = await this.repository.update(id, updateMuscleGroupDto);
    if (!muscleGroup) {
      throw new NotFoundException(`Muscle group with id #${id} not found`);
    }
    return muscleGroup;
  }

  async remove(id: string): Promise<MuscleGroup> {
    const muscleGroup = await this.repository.delete(id);
    if (!muscleGroup) {
      throw new NotFoundException(`Muscle group with id #${id} not found`);
    }
    return muscleGroup;
  }
}
