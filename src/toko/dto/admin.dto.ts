import { IsString, IsEmail, IsNotEmpty, IsPhoneNumber, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  nama: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  no_handphone: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}