import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../auth/enums/role.enum';

export class UserDto {
  @ApiProperty({
    example: '60d5ecb8b392d6622c8e4a1a',
    description: 'The unique identifier of the user',
  })
  id: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  name: string;

  @ApiProperty({ example: 25, description: 'The age of the user' })
  age: number;

  @ApiProperty({
    example: [Role.USER],
    description: 'The roles of the user',
    enum: Role,
    isArray: true,
  })
  roles: Role[];
}
