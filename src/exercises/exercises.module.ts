import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';
import { ExercisesRepository } from './exercises.repository';
import { Exercise, ExerciseSchema } from './entities/exercise.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Exercise.name, schema: ExerciseSchema },
    ]),
  ],
  controllers: [ExercisesController],
  providers: [ExercisesService, ExercisesRepository],
  exports: [ExercisesService],
})
export class ExercisesModule {}
