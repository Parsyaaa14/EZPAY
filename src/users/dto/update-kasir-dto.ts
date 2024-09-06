
import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { StatusUser } from '../entities/user.entity';

export class EditKasirDto {
  @IsOptional()
  @IsString()
  nama?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  status?: StatusUser;

  @IsOptional()
  @IsString()
  @MinLength(5)
  password?: string;
}