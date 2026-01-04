import { MuscleGroup } from '../../muscle-groups/enums/muscle-group.enum';
import { CreateExerciseDto } from '../../exercises/dto/create-exercise.dto';

export const SEED_EXERCISES: CreateExerciseDto[] = [
  // Gym Classics
  {
    name: 'Bench Press',
    description: 'A classic chest exercise using a barbell',
    muscleGroup: MuscleGroup.CHEST,
  },
  {
    name: 'Overhead Press',
    description: 'A shoulder exercise using a barbell or dumbbells',
    muscleGroup: MuscleGroup.SHOULDERS,
  },
  {
    name: 'Squats',
    description: 'A compound leg exercise',
    muscleGroup: MuscleGroup.QUADRICEPS,
  },
  {
    name: 'Deadlifts',
    description: 'A compound exercise for the posterior chain',
    muscleGroup: MuscleGroup.LOWER_BACK,
  },
  {
    name: 'Bicep Curls',
    description: 'An isolation exercise for the biceps',
    muscleGroup: MuscleGroup.BICEPS,
  },
  {
    name: 'Tricep Extensions',
    description: 'An isolation exercise for the triceps',
    muscleGroup: MuscleGroup.TRICEPS,
  },
  // Calisthenics
  {
    name: 'Pull-ups',
    description: 'A fundamental back exercise using bodyweight',
    muscleGroup: MuscleGroup.BACK,
  },
  {
    name: 'Push-ups',
    description: 'Standard bodyweight push-ups for chest and triceps',
    muscleGroup: MuscleGroup.CHEST,
  },
  {
    name: 'Dips',
    description: 'Bodyweight dips on parallel bars',
    muscleGroup: MuscleGroup.CHEST,
  },
  {
    name: 'Muscle-ups',
    description: 'Advanced calisthenics move combining a pull-up and a dip',
    muscleGroup: MuscleGroup.BACK,
  },
  {
    name: 'Chin-ups',
    description: 'Pull-up variation with supinated grip focusing on biceps',
    muscleGroup: MuscleGroup.BICEPS,
  },
  {
    name: 'Diamond Push-ups',
    description: 'Push-up variation focusing on the triceps',
    muscleGroup: MuscleGroup.TRICEPS,
  },
  {
    name: 'Australian Pull-ups',
    description: 'Horizontal pull-ups for beginners',
    muscleGroup: MuscleGroup.BACK,
  },
  {
    name: 'Leg Raises',
    description: 'Hanging leg raises for core strength',
    muscleGroup: MuscleGroup.ABS,
  },
  {
    name: 'L-Sit',
    description: 'Static hold for core and shoulder stability',
    muscleGroup: MuscleGroup.ABS,
  },
];
