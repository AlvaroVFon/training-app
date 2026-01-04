import { MuscleGroup } from '../../muscle-groups/enums/muscle-group.enum';
import { CreateMuscleGroupDto } from '../../muscle-groups/dto/create-muscle-group.dto';

export const SEED_MUSCLE_GROUPS: CreateMuscleGroupDto[] = Object.values(
  MuscleGroup,
).map((name) => ({
  name,
  description: `Description for ${name.toLowerCase().replace('_', ' ')}`,
}));
