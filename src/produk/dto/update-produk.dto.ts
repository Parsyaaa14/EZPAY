import { PartialType } from '@nestjs/swagger';
import { CreateProdukDto } from './create-produk.dto';
import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { StatusProduk } from '../entities/produk.entity';

export class UpdateProdukDto extends PartialType(CreateProdukDto) {
  nama_produk?: string;

  @Type(() => Number)
  harga_produk?: number;

  @Type(() => Number)
  stok?: number;

  gambar_produk?: string;

  kode_produk?: string;

  satuan_produk?: string;

  @IsOptional()
  nama?: string;


  status_produk?: StatusProduk;
}
