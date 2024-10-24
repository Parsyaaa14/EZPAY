import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';
import { StatusProduk } from '../entities/produk.entity';

export class CreateProdukDto {
  @IsOptional()
  @IsString()
  id_toko: string; // Menambahkan id_toko

  @IsOptional()
  @IsString()
  id_kategori: string; // Pastikan ini bertipe string

  @IsOptional()
  @IsString()
  nama_produk: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  harga_produk: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  stok: number;

  @IsOptional()
  @IsString()
  kode_produk: string;

  @IsOptional()
  @IsString()
  satuan_produk: string;

  @IsOptional()
  status_produk: StatusProduk; // Pastikan ini menggunakan enum StatusProduk

  @IsOptional()
  @IsString()
  gambar_produk: string; // Nama file gambar produk
}
