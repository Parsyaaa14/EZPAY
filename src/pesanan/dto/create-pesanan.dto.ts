import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { CreateDetilProdukPesananDto } from "src/detil_produk_pesanan/dto/create-detil_produk_pesanan.dto";

export class CreatePesananDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateDetilProdukPesananDto)
    detil_produk_pesanan: CreateDetilProdukPesananDto[];
  }
