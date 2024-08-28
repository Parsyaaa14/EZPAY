import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  nama : string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  no_handphone: string;

  @IsNotEmpty()
  salt: string;

  @IsNotEmpty()
  status: string;

}
