import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { WorkoutsService } from './workouts.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { WorkoutDto } from './dto/workout.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkoutOwnershipGuard } from '../auth/guards/workout-ownership.guard';
import { ValidateObjectIdGuard } from 'src/auth/guards/validate-object-id.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { GetResource } from '../common/decorators/get-resource.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';

@ApiTags('workouts (templates)')
@ApiBearerAuth()
@ApiExtraModels(PaginatedResponseDto, WorkoutDto)
@UseGuards(JwtAuthGuard)
@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new workout template' })
  @ApiResponse({ status: 201, type: WorkoutDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(
    @Body() createWorkoutDto: CreateWorkoutDto,
    @GetUser('id') userId: string,
  ) {
    return this.workoutsService.create(createWorkoutDto, userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all workout templates for the current user',
  })
  @ApiResponse({
    status: 200,
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(WorkoutDto) },
            },
          },
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(
    @GetUser('id') userId: string,
    @Query() pagination: PaginationQueryDto,
  ) {
    return this.workoutsService.findAll(userId, pagination);
  }

  @Get(':id')
  @UseGuards(ValidateObjectIdGuard, WorkoutOwnershipGuard)
  @ApiOperation({ summary: 'Get a workout template by id' })
  @ApiResponse({ status: 200, type: WorkoutDto })
  @ApiResponse({ status: 400, description: 'Invalid ID format' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden (No access to this workout)',
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  findOne(@GetResource('workout') workout: WorkoutDto) {
    return workout;
  }

  @Patch(':id')
  @UseGuards(ValidateObjectIdGuard, WorkoutOwnershipGuard)
  @ApiOperation({ summary: 'Update a workout template' })
  @ApiResponse({ status: 200, type: WorkoutDto })
  @ApiResponse({ status: 400, description: 'Invalid ID format or bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden (No access to this workout)',
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  update(
    @Param('id') id: string,
    @Body() updateWorkoutDto: UpdateWorkoutDto,
    @GetUser('id') userId: string,
  ) {
    return this.workoutsService.update(id, updateWorkoutDto, userId);
  }

  @Delete(':id')
  @UseGuards(ValidateObjectIdGuard, WorkoutOwnershipGuard)
  @ApiOperation({ summary: 'Delete a workout template' })
  @ApiResponse({ status: 200, type: WorkoutDto })
  @ApiResponse({ status: 400, description: 'Invalid ID format' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden (No access to this workout)',
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  remove(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.workoutsService.remove(id, userId);
  }
}
