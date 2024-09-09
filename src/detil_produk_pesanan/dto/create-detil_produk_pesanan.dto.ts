import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDetilProdukPesananDto {
  @IsNotEmpty()
  id_produk: string;

  @IsNotEmpty()
  jumlah_produk: number;
}

