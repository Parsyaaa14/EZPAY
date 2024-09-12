<<<<<<< HEAD
import { IsNotEmpty} from 'class-validator';
=======
import { IsNotEmpty, IsOptional } from 'class-validator';
>>>>>>> bca59a6 (1)
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
