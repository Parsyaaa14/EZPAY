import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsOptional, MinLength } from 'class-validator';
import { StatusUser } from '../entities/user.entity';

export class EditUserDto {
  @IsOptional()
  nama?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  no_handphone?: string;

  @IsOptional()
  status?: StatusUser;

  @IsOptional()
  @MinLength(5)
  password?: string;
}
