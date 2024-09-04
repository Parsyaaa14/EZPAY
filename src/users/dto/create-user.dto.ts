import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {

  @IsNotEmpty()
  nama : string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  no_handphone: string;


  salt: string;

  @IsNotEmpty()
  status: boolean;

}
