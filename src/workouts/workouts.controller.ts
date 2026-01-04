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
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { WorkoutsService } from './workouts.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { WorkoutDto } from './dto/workout.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';

@ApiTags('workouts')
@ApiBearerAuth()
@ApiExtraModels(PaginatedResponseDto, WorkoutDto)
@UseGuards(JwtAuthGuard)
@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new workout' })
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
  @ApiOperation({ summary: 'Get all workouts for the current user' })
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
  @ApiOperation({ summary: 'Get a workout by id' })
  @ApiResponse({ status: 200, type: WorkoutDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  findOne(
    @Param('id', ParseObjectIdPipe) id: string,
    @GetUser('id') userId: string,
  ) {
    return this.workoutsService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a workout' })
  @ApiResponse({ status: 200, type: WorkoutDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateWorkoutDto: UpdateWorkoutDto,
    @GetUser('id') userId: string,
  ) {
    return this.workoutsService.update(id, updateWorkoutDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a workout' })
  @ApiResponse({ status: 200, type: WorkoutDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  remove(
    @Param('id', ParseObjectIdPipe) id: string,
    @GetUser('id') userId: string,
  ) {
    return this.workoutsService.remove(id, userId);
  }
}
