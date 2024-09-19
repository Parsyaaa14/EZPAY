import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class EditPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
