import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { MuscleGroupsService } from './muscle-groups.service';
import { CreateMuscleGroupDto } from './dto/create-muscle-group.dto';
import { UpdateMuscleGroupDto } from './dto/update-muscle-group.dto';
import { MuscleGroupDto } from './dto/muscle-group.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('muscle-groups')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('muscle-groups')
export class MuscleGroupsController {
  constructor(private readonly muscleGroupsService: MuscleGroupsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new muscle group' })
  @ApiResponse({ status: 201, type: MuscleGroupDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden (Admin only)' })
  @ApiResponse({ status: 409, description: 'Conflict (Name already exists)' })
  create(@Body() createMuscleGroupDto: CreateMuscleGroupDto) {
    return this.muscleGroupsService.create(createMuscleGroupDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all muscle groups' })
  @ApiResponse({ status: 200, type: [MuscleGroupDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden (Admin only)' })
  findAll() {
    return this.muscleGroupsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a muscle group by id' })
  @ApiResponse({ status: 200, type: MuscleGroupDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden (Admin only)' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.muscleGroupsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a muscle group' })
  @ApiResponse({ status: 200, type: MuscleGroupDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden (Admin only)' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateMuscleGroupDto: UpdateMuscleGroupDto,
  ) {
    return this.muscleGroupsService.update(id, updateMuscleGroupDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a muscle group' })
  @ApiResponse({ status: 200, type: MuscleGroupDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden (Admin only)' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.muscleGroupsService.remove(id);
  }
}
