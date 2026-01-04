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
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ExerciseDto } from './dto/exercise.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Role } from '../auth/enums/role.enum';
import { ExerciseQueryDto } from './dto/exercise-query.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';

@ApiTags('exercises')
@ApiExtraModels(PaginatedResponseDto, ExerciseDto)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new exercise' })
  @ApiResponse({ status: 201, type: ExerciseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 409,
    description: 'Conflict (Name already exists for this user)',
  })
  create(
    @Body() createExerciseDto: CreateExerciseDto,
    @GetUser('id') userId: string,
    @GetUser('roles') roles: Role[],
  ) {
    const isAdmin = roles.includes(Role.ADMIN);
    return this.exercisesService.create(createExerciseDto, userId, isAdmin);
  }

  @Get()
  @ApiOperation({ summary: 'Get all accessible exercises (default + owned)' })
  @ApiResponse({
    status: 200,
    description: 'Return all accessible exercises paginated',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(ExerciseDto) },
            },
          },
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@GetUser('id') userId: string, @Query() query: ExerciseQueryDto) {
    return this.exercisesService.findAll(userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an exercise by id' })
  @ApiResponse({ status: 200, type: ExerciseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden (No access to this exercise)',
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  findOne(
    @Param('id', ParseObjectIdPipe) id: string,
    @GetUser('id') userId: string,
  ) {
    return this.exercisesService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an exercise' })
  @ApiResponse({ status: 200, type: ExerciseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden (Cannot modify default or others exercises)',
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
    @GetUser('id') userId: string,
    @GetUser('roles') roles: Role[],
  ) {
    return this.exercisesService.update(id, updateExerciseDto, userId, roles);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an exercise' })
  @ApiResponse({ status: 200, type: ExerciseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden (Cannot delete default or others exercises)',
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  remove(
    @Param('id', ParseObjectIdPipe) id: string,
    @GetUser('id') userId: string,
    @GetUser('roles') roles: Role[],
  ) {
    return this.exercisesService.remove(id, userId, roles);
  }
}
