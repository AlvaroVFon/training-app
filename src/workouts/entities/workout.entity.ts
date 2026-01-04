import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/entities/user.entity';
import { Exercise } from '../../exercises/entities/exercise.entity';

@Schema()
export class WorkoutSet {
  @Prop({ required: true })
  reps: number;

  @Prop({ required: true })
  weight: number;

  @Prop({ default: 0 })
  restTime: number; // in seconds

  @Prop()
  notes?: string;
}

const WorkoutSetSchema = SchemaFactory.createForClass(WorkoutSet);

@Schema()
export class WorkoutExercise {
  @Prop({ type: Types.ObjectId, ref: 'Exercise', required: true })
  exercise: Exercise | Types.ObjectId;

  @Prop({ type: [WorkoutSetSchema], required: true })
  sets: WorkoutSet[];

  @Prop()
  notes?: string;
}

const WorkoutExerciseSchema = SchemaFactory.createForClass(WorkoutExercise);

@Schema({ timestamps: true })
export class Workout extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  user: User | Types.ObjectId;

  @Prop({ required: true, default: Date.now })
  date: Date;

  @Prop({ type: [WorkoutExerciseSchema], default: [] })
  exercises: WorkoutExercise[];

  @Prop()
  notes?: string;
}

export const WorkoutSchema = SchemaFactory.createForClass(Workout);
