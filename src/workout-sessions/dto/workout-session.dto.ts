import { ApiProperty } from '@nestjs/swagger';
import { SessionStatus } from '../enums/session-status.enum';

export class SessionSetDto {
  @ApiProperty()
  reps: number;

  @ApiProperty()
  weight: number;

  @ApiProperty()
  restTime: number;

  @ApiProperty({ required: false })
  notes?: string;
}

export class SessionExerciseDto {
  @ApiProperty()
  exerciseId: string;

  @ApiProperty()
  exerciseName: string;

  @ApiProperty({ type: [SessionSetDto] })
  sets: SessionSetDto[];

  @ApiProperty({ required: false })
  notes?: string;
}

export class WorkoutSessionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  workoutTemplateId?: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty({ required: false })
  endDate?: Date;

  @ApiProperty({ enum: SessionStatus })
  status: SessionStatus;

  @ApiProperty({ type: [SessionExerciseDto] })
  exercises: SessionExerciseDto[];

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
