import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MuscleGroup } from '../../muscle-groups/enums/muscle-group.enum';

@Schema({ timestamps: true })
export class Exercise extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true, enum: MuscleGroup })
  muscleGroup: MuscleGroup;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  createdBy: Types.ObjectId | null;

  @Prop({ default: false })
  isDefault: boolean;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);

// Index for searching exercises by user or default
ExerciseSchema.index({ createdBy: 1, isDefault: 1 });
// Unique name per user or default
ExerciseSchema.index({ name: 1, createdBy: 1, isDefault: 1 }, { unique: true });
