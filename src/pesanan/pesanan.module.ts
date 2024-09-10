import { Module } from '@nestjs/common';
import { PesananService } from './pesanan.service';
import { PesananController } from './pesanan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pesanan } from './entities/pesanan.entity';
import { DetilProdukPesanan } from 'src/detil_produk_pesanan/entities/detil_produk_pesanan.entity';
import { Produk } from 'src/produk/entities/produk.entity';
import { User } from 'src/users/entities/user.entity';
import { MetodeTransaksi } from 'src/metode_transaksi/entities/metode_transaksi.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pesanan, DetilProdukPesanan, Produk, User, MetodeTransaksi])],
  controllers: [PesananController],
  providers: [PesananService]
})
export class PesananModule {}
