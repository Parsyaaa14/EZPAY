import { PartialType } from '@nestjs/swagger';
import { CreateDetilProdukPesananDto } from './create-detil_produk_pesanan.dto';

export class UpdateDetilProdukPesananDto extends PartialType(CreateDetilProdukPesananDto) {}
