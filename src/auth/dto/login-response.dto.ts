import { ApiProperty } from '@nestjs/swagger';
import { ProfileDto } from './profile.dto';

export class LoginResponseDto {
  @ApiProperty({ type: ProfileDto })
  user: ProfileDto;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  access_token: string;
}
