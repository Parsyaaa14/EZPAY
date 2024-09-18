// src/auth/dto/register.dto.ts
import { IsEmail, IsNotEmpty, IsPhoneNumber, MinLength, IsOptional } from 'class-validator';

export class DaftarDto {
  @IsNotEmpty()
  nama: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  no_handphone: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  nama_toko: string;

  @IsOptional()
  deskripsi_toko?: string;

  @IsNotEmpty()
  alamat_toko: string;

  @IsOptional()
  foto?: string; // Assuming it's a URL or file path
}
