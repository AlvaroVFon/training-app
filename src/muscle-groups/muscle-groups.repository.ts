import { Model } from 'mongoose';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MuscleGroup } from './entities/muscle-group.entity';
import { CreateMuscleGroupDto } from './dto/create-muscle-group.dto';
import { UpdateMuscleGroupDto } from './dto/update-muscle-group.dto';

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

  async findAll(): Promise<MuscleGroup[]> {
    return this.muscleGroupModel.find().exec();
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
