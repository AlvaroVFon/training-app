import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Role } from '../../auth/enums/role.enum';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age: number;

  @Prop({ type: [String], enum: Role, default: [Role.USER] })
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 1 }, { unique: true });
