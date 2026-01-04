import { Model, Types } from 'mongoose';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exercise } from './entities/exercise.entity';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExercisesRepository {
  constructor(
    @InjectModel(Exercise.name) private exerciseModel: Model<Exercise>,
  ) {}

  async create(
    createExerciseDto: CreateExerciseDto,
    userId: string | null = null,
    isDefault = false,
  ): Promise<Exercise> {
    try {
      const createdBy = userId ? new Types.ObjectId(userId) : null;
      return await this.exerciseModel.create({
        ...createExerciseDto,
        createdBy,
        isDefault,
      });
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          'Exercise with this name already exists for this user',
        );
      }
      throw error;
    }
  }

  async findAll(userId: string): Promise<Exercise[]> {
    return this.exerciseModel
      .find({
        $or: [{ isDefault: true }, { createdBy: new Types.ObjectId(userId) }],
      })
      .exec();
  }

  async findById(id: string): Promise<Exercise | null> {
    return this.exerciseModel.findById(id).exec();
  }

  async findByName(
    name: string,
    userId: string | null = null,
    isDefault = false,
  ): Promise<Exercise | null> {
    const query: any = { name };
    if (isDefault) {
      query.isDefault = true;
    } else if (userId) {
      query.createdBy = new Types.ObjectId(userId);
    }
    return this.exerciseModel.findOne(query).exec();
  }

  async update(
    id: string,
    updateExerciseDto: UpdateExerciseDto,
  ): Promise<Exercise | null> {
    return this.exerciseModel
      .findByIdAndUpdate(id, updateExerciseDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Exercise | null> {
    return this.exerciseModel.findByIdAndDelete(id).exec();
  }
}
