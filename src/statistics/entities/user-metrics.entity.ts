import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class UserMetric extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: false })
  weight?: number;

  @Prop({ required: false })
  height?: number;

  @Prop({ required: false })
  bodyFat?: number;

  @Prop({ default: Date.now })
  measuredAt: Date;
}

export const UserMetricSchema = SchemaFactory.createForClass(UserMetric);
