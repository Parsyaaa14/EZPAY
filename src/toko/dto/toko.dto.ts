import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTokoDto {
  @IsString()
  @IsNotEmpty()
  nama_toko: string;

  @IsString()
  @IsNotEmpty()
  alamat_toko: string;

  @IsString()
  @IsNotEmpty()
  deskripsi_toko: string;

  @IsOptional()
  @IsString()
  foto?: string; // Optional jika tidak ada foto
}
