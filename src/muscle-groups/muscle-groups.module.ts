import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MuscleGroupsService } from './muscle-groups.service';
import { MuscleGroupsController } from './muscle-groups.controller';
import { MuscleGroupsRepository } from './muscle-groups.repository';
import { MuscleGroup, MuscleGroupSchema } from './entities/muscle-group.entity';
import { CommonModule } from '../common/common.module';
import { ValidateObjectIdGuard } from '../auth/guards/validate-object-id.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MuscleGroup.name, schema: MuscleGroupSchema },
    ]),
    CommonModule,
  ],
  controllers: [MuscleGroupsController],
  providers: [
    MuscleGroupsService,
    MuscleGroupsRepository,
    ValidateObjectIdGuard,
  ],
  exports: [MuscleGroupsService],
})
export class MuscleGroupsModule {}
