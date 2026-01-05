import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkoutsService } from './workouts.service';
import { WorkoutsController } from './workouts.controller';
import { WorkoutsRepository } from './workouts.repository';
import { Workout, WorkoutSchema } from './entities/workout.entity';
import { CommonModule } from '../common/common.module';
import { WorkoutOwnershipGuard } from '../auth/guards/workout-ownership.guard';
import { ValidateObjectIdGuard } from '../auth/guards/validate-object-id.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Workout.name, schema: WorkoutSchema }]),
    CommonModule,
  ],
  controllers: [WorkoutsController],
  providers: [
    WorkoutsService,
    WorkoutsRepository,
    WorkoutOwnershipGuard,
    ValidateObjectIdGuard,
  ],
  exports: [WorkoutsService],
})
export class WorkoutsModule {}
