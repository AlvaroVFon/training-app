import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { MuscleGroup } from '../../muscle-groups/enums/muscle-group.enum';

export class ExerciseQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: MuscleGroup,
    description: 'Filter exercises by muscle group',
  })
  @IsOptional()
  @IsEnum(MuscleGroup)
  muscleGroup?: MuscleGroup;
}
