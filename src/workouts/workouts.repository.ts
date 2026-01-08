import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Workout } from './entities/workout.entity';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class WorkoutsRepository {
  constructor(
    @InjectModel(Workout.name) private readonly workoutModel: Model<Workout>,
  ) {}

  async create(
    createWorkoutDto: CreateWorkoutDto,
    userId: string,
  ): Promise<Workout> {
    const { exercises, ...workoutData } = createWorkoutDto;

    const mappedExercises = exercises.map((ex) => ({
      exercise: new Types.ObjectId(ex.exerciseId),
      sets: ex.sets,
      notes: ex.notes,
    }));

    const newWorkout = new this.workoutModel({
      ...workoutData,
      user: new Types.ObjectId(userId),
      exercises: mappedExercises,
    });

    return newWorkout.save();
  }

  async findAll(
    userId: string,
    pagination: PaginationQueryDto,
  ): Promise<{ data: Workout[]; total: number }> {
    const { page = 1, limit = 10, search } = pagination;
    const skip = (page - 1) * limit;

    const filter: any = { user: new Types.ObjectId(userId) };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.workoutModel
        .find(filter)
        .populate('exercises.exercise')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.workoutModel.countDocuments(filter).exec(),
    ]);

    return { data, total };
  }

  async findOne(id: string, userId?: string): Promise<Workout | null> {
    const filter: any = { _id: new Types.ObjectId(id) };
    if (userId) {
      filter.user = new Types.ObjectId(userId);
    }
    return this.workoutModel
      .findOne(filter)
      .populate('exercises.exercise')
      .exec();
  }

  async update(
    id: string,
    updateWorkoutDto: UpdateWorkoutDto,
    userId: string,
  ): Promise<Workout | null> {
    const { exercises, ...workoutData } = updateWorkoutDto;

    const updateData: any = { ...workoutData };

    if (exercises) {
      updateData.exercises = exercises.map((ex) => ({
        exercise: new Types.ObjectId(ex.exerciseId),
        sets: ex.sets,
        notes: ex.notes,
      }));
    }

    return this.workoutModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(id), user: new Types.ObjectId(userId) },
        { $set: updateData },
        { new: true },
      )
      .populate('exercises.exercise')
      .exec();
  }

  async remove(id: string, userId: string): Promise<Workout | null> {
    return this.workoutModel
      .findOneAndDelete({
        _id: new Types.ObjectId(id),
        user: new Types.ObjectId(userId),
      })
      .exec();
  }
}
