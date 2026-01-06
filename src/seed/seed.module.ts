import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { UsersModule } from '../users/users.module';
import { MuscleGroupsModule } from '../muscle-groups/muscle-groups.module';
import { ExercisesModule } from '../exercises/exercises.module';
import { WorkoutsModule } from '../workouts/workouts.module';
import { WorkoutSessionsModule } from '../workout-sessions/workout-sessions.module';

@Module({
  imports: [
    UsersModule,
    MuscleGroupsModule,
    ExercisesModule,
    WorkoutsModule,
    WorkoutSessionsModule,
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
