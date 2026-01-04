import { ApiProperty } from '@nestjs/swagger';
import { MuscleGroup as MuscleGroupEnum } from '../enums/muscle-group.enum';

export class MuscleGroupDto {
  @ApiProperty({ example: '60d5ecb8b392d60015f8e1a1' })
  id: string;

  @ApiProperty({ enum: MuscleGroupEnum })
  name: MuscleGroupEnum;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
