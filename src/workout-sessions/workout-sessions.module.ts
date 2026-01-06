import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkoutSessionsService } from './workout-sessions.service';
import { WorkoutSessionsController } from './workout-sessions.controller';
import { WorkoutSessionsRepository } from './workout-sessions.repository';
import {
  WorkoutSession,
  WorkoutSessionSchema,
} from './entities/workout-session.entity';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WorkoutSession.name, schema: WorkoutSessionSchema },
    ]),
    CommonModule,
  ],
  controllers: [WorkoutSessionsController],
  providers: [WorkoutSessionsService, WorkoutSessionsRepository],
  exports: [WorkoutSessionsService, WorkoutSessionsRepository],
})
export class WorkoutSessionsModule {}
