import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiExtraModels,
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
import { UserMetricDto } from './dto/user-metric.dto';
import { DateRangeDto } from './dto/date-range.dto';
import { CreateUserMetricDto } from './dto/create-user-metric.dto';

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

  @Post('metrics')
  @ApiOperation({
    summary: 'Record a new physical metric (weight, height, etc)',
  })
  @ApiResponse({ status: 201, type: UserMetricDto })
  async addMetric(
    @GetUser('id') loggedInUserId: string,
    @Body() metricData: CreateUserMetricDto,
  ) {
    return this.statisticsService.addMetric(loggedInUserId, metricData);
  }

  @Post('metrics/:userId')
  @ApiOperation({
    summary: 'Record a new physical metric for another user (Admin only)',
  })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'User ID',
  })
  @ApiResponse({ status: 201, type: UserMetricDto })
  async addMetricForUser(
    @Body() metricData: CreateUserMetricDto,
    @Param('userId') userId: string,
  ) {
    return this.statisticsService.addMetric(userId, metricData);
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get history of physical metrics' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiResponse({ status: 200, type: [UserMetricDto] })
  async getMetrics(
    @GetUser('id') loggedInUserId: string,
    @Query() dateRange: DateRangeDto,
  ) {
    return this.statisticsService.getMetrics(loggedInUserId, dateRange);
  }

  @Get('metrics/:userId')
  @ApiOperation({ summary: 'Get history of physical metrics for another user' })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'User ID',
  })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiResponse({ status: 200, type: [UserMetricDto] })
  async getMetricsForUser(
    @Query() dateRange: DateRangeDto,
    @Param('userId') userId: string,
  ) {
    return this.statisticsService.getMetrics(userId, dateRange);
  }
}
