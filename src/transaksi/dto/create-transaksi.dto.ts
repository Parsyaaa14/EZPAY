import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateTransaksiDto {
  @IsString()
  @IsNotEmpty()
  id_pesanan: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  id_metodeTransaksi: string[]; // Array untuk mendukung relasi many-to-many
}
