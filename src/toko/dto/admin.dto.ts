import { IsString, IsEmail, IsNotEmpty, IsPhoneNumber, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  nama: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsPhoneNumber('ID') // 'ID' untuk Indonesia, sesuaikan dengan negara
  @IsNotEmpty()
  no_handphone: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}