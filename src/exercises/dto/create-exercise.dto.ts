import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MuscleGroup } from '../../muscle-groups/enums/muscle-group.enum';

export class CreateExerciseDto {
  @ApiProperty({
    example: 'Bench Press',
    description: 'The name of the exercise',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'A classic chest exercise',
    description: 'A brief description of the exercise',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: MuscleGroup.CHEST,
    description: 'The primary muscle group targeted',
    enum: MuscleGroup,
  })
  @IsEnum(MuscleGroup)
  @IsNotEmpty()
  muscleGroup: MuscleGroup;
}
