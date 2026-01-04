import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { UsersModule } from '../users/users.module';
import { MuscleGroupsModule } from '../muscle-groups/muscle-groups.module';

@Module({
  imports: [UsersModule, MuscleGroupsModule],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
