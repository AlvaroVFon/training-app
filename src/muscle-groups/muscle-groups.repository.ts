import { Model } from 'mongoose';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MuscleGroup } from './entities/muscle-group.entity';
import { CreateMuscleGroupDto } from './dto/create-muscle-group.dto';
import { UpdateMuscleGroupDto } from './dto/update-muscle-group.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class MuscleGroupsRepository {
  constructor(
    @InjectModel(MuscleGroup.name) private muscleGroupModel: Model<MuscleGroup>,
  ) {}

  async create(
    createMuscleGroupDto: CreateMuscleGroupDto,
  ): Promise<MuscleGroup> {
    try {
      return await this.muscleGroupModel.create(createMuscleGroupDto);
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          'Muscle group with this name already exists',
        );
      }
      throw error;
    }
  }

  async findAll(
    pagination: PaginationQueryDto,
  ): Promise<{ data: MuscleGroup[]; total: number }> {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.muscleGroupModel.find().skip(skip).limit(limit).exec(),
      this.muscleGroupModel.countDocuments().exec(),
    ]);

    return { data, total };
  }

  async findById(id: string): Promise<MuscleGroup | null> {
    return this.muscleGroupModel.findById(id).exec();
  }

  async findByName(name: string): Promise<MuscleGroup | null> {
    return this.muscleGroupModel.findOne({ name }).exec();
  }

  async update(
    id: string,
    updateMuscleGroupDto: UpdateMuscleGroupDto,
  ): Promise<MuscleGroup | null> {
    return this.muscleGroupModel
      .findByIdAndUpdate(id, updateMuscleGroupDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<MuscleGroup | null> {
    return this.muscleGroupModel.findByIdAndDelete(id).exec();
  }
}
