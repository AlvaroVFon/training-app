import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { WorkoutSession } from './entities/workout-session.entity';
import { CreateWorkoutSessionDto } from './dto/create-workout-session.dto';
import { UpdateWorkoutSessionDto } from './dto/update-workout-session.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class WorkoutSessionsRepository {
  constructor(
    @InjectModel(WorkoutSession.name)
    private readonly sessionModel: Model<WorkoutSession>,
  ) {}

  async create(
    createDto: CreateWorkoutSessionDto,
    userId: string,
  ): Promise<WorkoutSession> {
    const { exercises, workoutTemplateId, startDate, ...data } = createDto;

    const mappedExercises =
      exercises?.map((ex) => ({
        exercise: new Types.ObjectId(ex.exerciseId),
        sets: ex.sets,
        notes: ex.notes,
      })) || [];

    const newSession = new this.sessionModel({
      ...data,
      user: new Types.ObjectId(userId),
      workoutTemplate: workoutTemplateId
        ? new Types.ObjectId(workoutTemplateId)
        : undefined,
      startDate: startDate ? new Date(startDate) : new Date(),
      exercises: mappedExercises,
    });

    return newSession.save();
  }

  async findAll(
    userId: string,
    pagination: PaginationQueryDto,
  ): Promise<{ data: WorkoutSession[]; total: number }> {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;
    const filter = { user: new Types.ObjectId(userId) };

    const [data, total] = await Promise.all([
      this.sessionModel
        .find(filter)
        .populate('exercises.exercise')
        .sort({ startDate: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.sessionModel.countDocuments(filter).exec(),
    ]);

    return { data, total };
  }

  async findOne(id: string, userId: string): Promise<WorkoutSession | null> {
    return this.sessionModel
      .findOne({
        _id: new Types.ObjectId(id),
        user: new Types.ObjectId(userId),
      })
      .populate('exercises.exercise')
      .exec();
  }

  async update(
    id: string,
    updateDto: UpdateWorkoutSessionDto,
    userId: string,
  ): Promise<WorkoutSession | null> {
    const { exercises, workoutTemplateId, startDate, endDate, ...data } =
      updateDto;

    const updateData: any = { ...data };

    if (exercises) {
      updateData.exercises = exercises.map((ex) => ({
        exercise: new Types.ObjectId(ex.exerciseId),
        sets: ex.sets,
        notes: ex.notes,
      }));
    }

    if (workoutTemplateId) {
      updateData.workoutTemplate = new Types.ObjectId(workoutTemplateId);
    }

    if (startDate) {
      updateData.startDate = new Date(startDate);
    }

    if (endDate) {
      updateData.endDate = new Date(endDate);
    }

    return this.sessionModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(id), user: new Types.ObjectId(userId) },
        { $set: updateData },
        { new: true },
      )
      .populate('exercises.exercise')
      .exec();
  }

  async remove(id: string, userId: string): Promise<WorkoutSession | null> {
    return this.sessionModel
      .findOneAndDelete({
        _id: new Types.ObjectId(id),
        user: new Types.ObjectId(userId),
      })
      .exec();
  }
}
