import { IsNotEmpty } from "class-validator";

export class CreateProdukDto {
  @IsNotEmpty()
  nama_produk: string;

  @IsNotEmpty()
  harga_produk: number;

  @IsNotEmpty()
  stok: number;

  @IsNotEmpty()
  gambar_produk: string;

  @IsNotEmpty()
  kode_produk: string;

  @IsNotEmpty()
  satuan_produk: string;

  @IsNotEmpty()
  status_produk: boolean;
}
