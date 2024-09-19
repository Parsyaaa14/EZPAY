import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ValidateTokoDto {
  @IsEmail({}, { message: 'Email tidak valid' })
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}