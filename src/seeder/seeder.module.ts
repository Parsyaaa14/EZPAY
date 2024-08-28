import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { User } from '#/users/entities/user.entity';
import { Role } from '#/role/entities/role.entity';
import { Kategori } from '#/kategori/entities/kategori.entity';
import { Produk } from '#/produk/entities/produk.entity';
import { Toko } from '#/toko/entities/toko.entity';
import { MetodeTransaksi } from '#/metode_transaksi/entities/metode_transaksi.entity';
import { DetilProdukPesanan } from '#/detil_produk_pesanan/entities/detil_produk_pesanan.entity';

@Module({

  imports: [TypeOrmModule.forFeature([User, Role, Kategori, Produk, Toko, MetodeTransaksi, DetilProdukPesanan])],
  providers: [SeederService],
})
export class SeederModule {}
