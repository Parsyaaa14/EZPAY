import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { StatusProduk } from '../entities/produk.entity';

export class CreateProdukDto {
  @IsOptional()
  id_kategori: string;
  @IsOptional()
  nama_produk: string;
  @IsOptional()
  @Type(() => Number)
  harga_produk: number;
  @IsOptional()
  @Type(() => Number)
  stok: number;
  @IsOptional()
  kode_produk: string;
  @IsOptional()
  satuan_produk: string;

  @IsOptional()
  status_produk: StatusProduk;

  @IsOptional()
  gambar_produk: string;
}
