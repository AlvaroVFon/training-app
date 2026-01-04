import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { UsersModule } from '../users/users.module';
import { MuscleGroupsModule } from '../muscle-groups/muscle-groups.module';
import { ExercisesModule } from '../exercises/exercises.module';

@Module({
  imports: [UsersModule, MuscleGroupsModule, ExercisesModule],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
