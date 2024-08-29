import { Module } from '@nestjs/common';
import { DetilProdukPesananService } from './detil_produk_pesanan.service';
import { DetilProdukPesananController } from './detil_produk_pesanan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetilProdukPesanan } from './entities/detil_produk_pesanan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DetilProdukPesanan])],
  controllers: [DetilProdukPesananController],
  providers: [DetilProdukPesananService]
})
export class DetilProdukPesananModule {}
