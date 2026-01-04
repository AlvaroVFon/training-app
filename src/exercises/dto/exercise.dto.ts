import { ApiProperty } from '@nestjs/swagger';
import { MuscleGroup } from '../../muscle-groups/enums/muscle-group.enum';

export class ExerciseDto {
  @ApiProperty({ example: '60d5ecb8b392d60015f8e1a1' })
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ enum: MuscleGroup })
  muscleGroup: MuscleGroup;

  @ApiProperty({ required: false, example: '60d5ecb8b392d60015f8e1a2' })
  createdBy?: string;

  @ApiProperty()
  isDefault: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
