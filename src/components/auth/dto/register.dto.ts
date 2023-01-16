import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEmail()
  email: string;
}
