import { Module } from '@nestjs/common';
import { DetilProdukPesananService } from './detil_produk_pesanan.service';
import { DetilProdukPesananController } from './detil_produk_pesanan.controller';

@Module({
  controllers: [DetilProdukPesananController],
  providers: [DetilProdukPesananService]
})
export class DetilProdukPesananModule {}
