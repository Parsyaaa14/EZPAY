import { IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateProdukDto {
  @IsString()
  @IsNotEmpty()
  nama_produk: string;

  @IsNumber()
  @IsNotEmpty()
  harga_produk: number;

  @IsNumber()
  @IsNotEmpty()
  stok: number;

  @IsString()
  @IsNotEmpty()
  gambar_produk: string;

  @IsString()
  @IsNotEmpty()
  kode_produk: string;

  @IsString()
  @IsNotEmpty()
  satuan_produk: string;

  @IsBoolean()
  @IsNotEmpty()
  status_produk: boolean;
}
