import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Workout } from './entities/workout.entity';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';

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

  async findAll(userId: string): Promise<Workout[]> {
    return this.workoutModel
      .find({ user: new Types.ObjectId(userId) })
      .populate('exercises.exercise')
      .sort({ date: -1 })
      .exec();
  }

  async findOne(id: string, userId: string): Promise<Workout | null> {
    return this.workoutModel
      .findOne({
        _id: new Types.ObjectId(id),
        user: new Types.ObjectId(userId),
      })
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
