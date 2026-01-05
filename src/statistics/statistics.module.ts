import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { StatisticsRepository } from './statistics.repository';
import { Workout, WorkoutSchema } from '../workouts/entities/workout.entity';
import {
  Exercise,
  ExerciseSchema,
} from '../exercises/entities/exercise.entity';
import { ExercisesModule } from '../exercises/exercises.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Workout.name, schema: WorkoutSchema },
      { name: Exercise.name, schema: ExerciseSchema },
    ]),
    ExercisesModule,
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService, StatisticsRepository],
})
export class StatisticsModule {}
