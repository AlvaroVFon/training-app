import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkoutsService } from './workouts.service';
import { WorkoutsController } from './workouts.controller';
import { WorkoutsRepository } from './workouts.repository';
import { Workout, WorkoutSchema } from './entities/workout.entity';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Workout.name, schema: WorkoutSchema }]),
    CommonModule,
  ],
  controllers: [WorkoutsController],
  providers: [WorkoutsService, WorkoutsRepository],
  exports: [WorkoutsService],
})
export class WorkoutsModule {}
