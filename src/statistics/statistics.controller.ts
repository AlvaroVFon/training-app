import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ValidateObjectIdGuard } from '../auth/guards/validate-object-id.guard';
import { UserIsSelfGuard } from '../auth/guards/user-is-self.guard';
import { ExerciseOwnershipGuard } from '../auth/guards/exercise-ownership.guard';
import {
  StatisticsSummaryDto,
  MuscleDistributionDto,
  ExerciseProgressDto,
} from './dto/statistics-responses.dto';
import { DateRangeDto } from './dto/date-range.dto';

@ApiTags('statistics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, ValidateObjectIdGuard, UserIsSelfGuard)
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get(['summary', 'summary/:userId'])
  @ApiOperation({
    summary: 'Get general training statistics summary (CLOSED sessions only)',
  })
  @ApiParam({
    name: 'userId',
    required: false,
    description: 'User ID (Admin only can specify other users)',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'ISO 8601 date',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'ISO 8601 date',
  })
  @ApiResponse({ status: 200, type: StatisticsSummaryDto })
  getSummary(
    @GetUser('id') loggedInUserId: string,
    @Query() dateRange: DateRangeDto,
    @Param('userId') userId?: string,
  ) {
    return this.statisticsService.getSummary(
      userId || loggedInUserId,
      dateRange,
    );
  }

  @Get(['muscle-distribution', 'muscle-distribution/:userId'])
  @ApiOperation({
    summary: 'Get distribution of sets per muscle group (CLOSED sessions only)',
  })
  @ApiParam({
    name: 'userId',
    required: false,
    description: 'User ID (Admin only can specify other users)',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'ISO 8601 date',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'ISO 8601 date',
  })
  @ApiResponse({ status: 200, type: [MuscleDistributionDto] })
  getMuscleDistribution(
    @GetUser('id') loggedInUserId: string,
    @Query() dateRange: DateRangeDto,
    @Param('userId') userId?: string,
  ) {
    return this.statisticsService.getMuscleDistribution(
      userId || loggedInUserId,
      dateRange,
    );
  }

  @Get(['progress/:exerciseId', 'progress/:exerciseId/:userId'])
  @UseGuards(ExerciseOwnershipGuard)
  @ApiOperation({
    summary: 'Get progression for a specific exercise (CLOSED sessions only)',
  })
  @ApiParam({ name: 'exerciseId', required: true })
  @ApiParam({
    name: 'userId',
    required: false,
    description: 'User ID (Admin only can specify other users)',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'ISO 8601 date',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'ISO 8601 date',
  })
  @ApiResponse({ status: 200, type: [ExerciseProgressDto] })
  getExerciseProgress(
    @GetUser('id') loggedInUserId: string,
    @Param('exerciseId') exerciseId: string,
    @Query() dateRange: DateRangeDto,
    @Param('userId') userId?: string,
  ) {
    return this.statisticsService.getExerciseProgress(
      userId || loggedInUserId,
      exerciseId,
      dateRange,
    );
  }
}
