import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  new_password;

  @IsString()
  @IsNotEmpty()
  confirm_password;
}
