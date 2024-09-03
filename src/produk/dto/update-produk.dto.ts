import { PartialType } from '@nestjs/swagger';
import { CreateProdukDto } from './create-produk.dto';
import { IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProdukDto extends PartialType(CreateProdukDto) {
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
    gambar_produk: string;
  
    @IsString()
    @IsNotEmpty()
    kode_produk: string;
  
    @IsString()
    @IsNotEmpty()
    satuan_produk: string;
  
    @IsNotEmpty()
    @Type(() => Boolean)
    status_produk: boolean;
}
