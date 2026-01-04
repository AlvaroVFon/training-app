import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MuscleGroup as MuscleGroupEnum } from '../enums/muscle-group.enum';

export class CreateMuscleGroupDto {
  @ApiProperty({
    example: MuscleGroupEnum.CHEST,
    description: 'The name of the muscle group',
    enum: MuscleGroupEnum,
  })
  @IsEnum(MuscleGroupEnum)
  @IsNotEmpty()
  name: MuscleGroupEnum;

  @ApiProperty({
    example: 'The chest muscles',
    description: 'A brief description of the muscle group',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
