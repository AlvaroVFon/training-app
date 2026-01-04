import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../auth/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 25, description: 'The age of the user' })
  @IsNumber()
  age: number;

  @ApiProperty({
    example: [Role.USER],
    description: 'The roles of the user',
    enum: Role,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsEnum(Role, { each: true })
  roles?: Role[];
}
