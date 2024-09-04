import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserKasirDto {
  @IsNotEmpty()
  nama: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  status: boolean;
}
