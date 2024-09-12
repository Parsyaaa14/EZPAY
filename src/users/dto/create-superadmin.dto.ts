import { IsNotEmpty} from 'class-validator';
import { StatusUser } from '../entities/user.entity';

export class CreateSuperadminDto {

  @IsNotEmpty()
  nama : string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  no_handphone: string;

  @IsNotEmpty()
  status: StatusUser;

  @IsNotEmpty()
  password: string;

}