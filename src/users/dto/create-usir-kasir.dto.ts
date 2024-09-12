import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { StatusUser } from '../entities/user.entity';

export class CreateUserKasirDto {
  @IsNotEmpty()
  nama: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  status: StatusUser;

}
