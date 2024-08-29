import { PartialType } from '@nestjs/swagger';
import { CreateProdukDto } from './create-produk.dto';
import { IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator';

export class UpdateProdukDto extends PartialType(CreateProdukDto) {
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
