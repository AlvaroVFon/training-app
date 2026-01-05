import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';
import { ExercisesRepository } from './exercises.repository';
import { Exercise, ExerciseSchema } from './entities/exercise.entity';
import { CommonModule } from '../common/common.module';
import { ExerciseOwnershipGuard } from '../auth/guards/exercise-ownership.guard';
import { ValidateObjectIdGuard } from '../auth/guards/validate-object-id.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Exercise.name, schema: ExerciseSchema },
    ]),
    CommonModule,
  ],
  controllers: [ExercisesController],
  providers: [
    ExercisesService,
    ExercisesRepository,
    ExerciseOwnershipGuard,
    ValidateObjectIdGuard,
  ],
  exports: [ExercisesService],
})
export class ExercisesModule {}
