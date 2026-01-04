import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
}
