import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateProdukDto {

  @IsNotEmpty()
  id_kategori: string;
  
  @IsString()
  @IsNotEmpty()
  nama_produk: string;


  @IsNotEmpty()
  @Type(() => Number)
  harga_produk: number;


  @IsNotEmpty()
  @Type(() => Number)
  stok: number;

  @IsString()
  @IsNotEmpty()
  kode_produk: string;

  @IsString()
  @IsNotEmpty()
  satuan_produk: string;

  @IsNotEmpty()
  @Type(() => Boolean)
  status_produk: boolean;

  @IsOptional()
  gambar_produk: string;
 
}
