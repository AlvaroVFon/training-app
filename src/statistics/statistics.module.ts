import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { StatisticsRepository } from './statistics.repository';
import {
  WorkoutSession,
  WorkoutSessionSchema,
} from '../workout-sessions/entities/workout-session.entity';
import {
  Exercise,
  ExerciseSchema,
} from '../exercises/entities/exercise.entity';
import { ExercisesModule } from '../exercises/exercises.module';
import { UserMetric, UserMetricSchema } from './entities/user-metrics.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WorkoutSession.name, schema: WorkoutSessionSchema },
      { name: Exercise.name, schema: ExerciseSchema },
      { name: UserMetric.name, schema: UserMetricSchema },
    ]),
    ExercisesModule,
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService, StatisticsRepository],
})
export class StatisticsModule {}
