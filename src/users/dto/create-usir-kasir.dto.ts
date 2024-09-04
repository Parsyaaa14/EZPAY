import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserKasirDto {
  @IsNotEmpty()
  nama: string;

  @IsNotEmpty()
  no_handphone: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  status: boolean;
}
