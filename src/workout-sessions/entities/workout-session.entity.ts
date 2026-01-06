import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/entities/user.entity';
import { Exercise } from '../../exercises/entities/exercise.entity';
import { Workout } from '../../workouts/entities/workout.entity';
import { SessionStatus } from '../enums/session-status.enum';

@Schema()
export class SessionSet {
  @Prop({ required: true })
  reps: number;

  @Prop({ required: true })
  weight: number;

  @Prop({ default: 0 })
  restTime: number; // in seconds

  @Prop()
  notes?: string;
}

const SessionSetSchema = SchemaFactory.createForClass(SessionSet);

@Schema()
export class SessionExercise {
  @Prop({ type: Types.ObjectId, ref: 'Exercise', required: true })
  exercise: Exercise | Types.ObjectId;

  @Prop({ type: [SessionSetSchema], required: true })
  sets: SessionSet[];

  @Prop()
  notes?: string;
}

const SessionExerciseSchema = SchemaFactory.createForClass(SessionExercise);

@Schema({ timestamps: true })
export class WorkoutSession extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  user: User | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Workout', required: false })
  workoutTemplate?: Workout | Types.ObjectId;

  @Prop({ required: true, default: Date.now })
  startDate: Date;

  @Prop({ required: false })
  endDate?: Date;

  @Prop({
    type: String,
    enum: SessionStatus,
    default: SessionStatus.OPEN,
    index: true,
  })
  status: SessionStatus;

  @Prop({ type: [SessionExerciseSchema], default: [] })
  exercises: SessionExercise[];

  @Prop()
  notes?: string;
}

export const WorkoutSessionSchema =
  SchemaFactory.createForClass(WorkoutSession);
