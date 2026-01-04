import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { MuscleGroup as MuscleGroupEnum } from '../enums/muscle-group.enum';

@Schema({ timestamps: true })
export class MuscleGroup {
  @Prop({ required: true, unique: true, enum: MuscleGroupEnum })
  name: MuscleGroupEnum;

  @Prop()
  description?: string;
}

export const MuscleGroupSchema = SchemaFactory.createForClass(MuscleGroup);
