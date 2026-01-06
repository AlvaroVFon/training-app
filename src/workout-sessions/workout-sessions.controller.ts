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
} from '@nestjs/swagger';
import { WorkoutSessionsService } from './workout-sessions.service';
import { CreateWorkoutSessionDto } from './dto/create-workout-session.dto';
import { UpdateWorkoutSessionDto } from './dto/update-workout-session.dto';
import { WorkoutSessionDto } from './dto/workout-session.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkoutSessionOwnershipGuard } from '../auth/guards/workout-session-ownership.guard';
import { ValidateObjectIdGuard } from '../auth/guards/validate-object-id.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';

@ApiTags('workout-sessions')
@ApiBearerAuth()
@ApiExtraModels(PaginatedResponseDto, WorkoutSessionDto)
@UseGuards(JwtAuthGuard)
@Controller('workout-sessions')
export class WorkoutSessionsController {
  constructor(private readonly sessionsService: WorkoutSessionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new workout session' })
  @ApiResponse({ status: 201, type: WorkoutSessionDto })
  create(
    @Body() createDto: CreateWorkoutSessionDto,
    @GetUser('id') userId: string,
  ) {
    return this.sessionsService.create(createDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all workout sessions for the current user' })
  @ApiResponse({ status: 200, type: PaginatedResponseDto })
  findAll(@GetUser('id') userId: string, @Query() query: PaginationQueryDto) {
    return this.sessionsService.findAll(userId, query);
  }

  @Get(':id')
  @UseGuards(ValidateObjectIdGuard, WorkoutSessionOwnershipGuard)
  @ApiOperation({ summary: 'Get a workout session by ID' })
  @ApiResponse({ status: 200, type: WorkoutSessionDto })
  @ApiResponse({ status: 404, description: 'Not Found' })
  findOne(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.sessionsService.findOne(id, userId);
  }

  @Patch(':id')
  @UseGuards(ValidateObjectIdGuard, WorkoutSessionOwnershipGuard)
  @ApiOperation({ summary: 'Update a workout session' })
  @ApiResponse({ status: 200, type: WorkoutSessionDto })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateWorkoutSessionDto,
    @GetUser('id') userId: string,
  ) {
    return this.sessionsService.update(id, updateDto, userId);
  }

  @Delete(':id')
  @UseGuards(ValidateObjectIdGuard, WorkoutSessionOwnershipGuard)
  @ApiOperation({ summary: 'Delete a workout session' })
  @ApiResponse({ status: 200, type: WorkoutSessionDto })
  remove(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.sessionsService.remove(id, userId);
  }

  @Post(':id/close')
  @UseGuards(ValidateObjectIdGuard, WorkoutSessionOwnershipGuard)
  @ApiOperation({ summary: 'Close a workout session' })
  @ApiResponse({ status: 200, type: WorkoutSessionDto })
  close(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.sessionsService.close(id, userId);
  }
}
