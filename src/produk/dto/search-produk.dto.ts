import { IsOptional, IsString } from 'class-validator';

export class SearchProdukDto {
  @IsOptional()
  nama_produk?: string;
}
