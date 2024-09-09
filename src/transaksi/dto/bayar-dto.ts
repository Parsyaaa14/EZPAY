import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class BayarDto {
  @IsString()
  @IsNotEmpty()
  id_pesanan: string; // Menggunakan id_pesanan karena kita mengacu pada pesanan yang sudah ada

  @IsNumber()
  @IsNotEmpty()
  totalBayar: number; // Total yang dibayar oleh pengguna

  @IsString()
  @IsNotEmpty()
  metodeTransaksiId: string; // ID metode pembayaran yang dipilih
}