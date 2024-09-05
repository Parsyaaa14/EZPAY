
import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class EditKasirDto {
  @IsOptional()
  @IsString()
  nama?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @IsString()
  @MinLength(5)
  password?: string;
}