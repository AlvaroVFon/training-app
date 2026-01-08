import { ApiProperty } from '@nestjs/swagger';

export class UserMetricDto {
  @ApiProperty({ example: '659a85b51d0a7a38e8192c44' })
  userId: string;

  @ApiProperty({ example: 80.5, required: false })
  weight?: number;

  @ApiProperty({ example: 175, required: false })
  height?: number;

  @ApiProperty({ example: 18.5, required: false })
  bodyFat?: number;

  @ApiProperty({ example: '2024-01-01T10:00:00.000Z' })
  measuredAt: Date;
}
