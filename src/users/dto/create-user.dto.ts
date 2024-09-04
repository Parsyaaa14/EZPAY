import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {

  @IsNotEmpty()
  nama : string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  no_handphone: string;


  @IsNotEmpty()
  status: boolean;

}
