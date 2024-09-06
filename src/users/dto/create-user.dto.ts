import { IsNotEmpty, IsOptional } from 'class-validator';
import { StatusUser } from '../entities/user.entity';

export class CreateUserDto {

  @IsNotEmpty()
  nama : string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  no_handphone: string;

  @IsNotEmpty()
  status: StatusUser;

}
