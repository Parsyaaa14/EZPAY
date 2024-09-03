import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
import { Kategori } from 'src/kategori/entities/kategori.entity';
import { Produk } from 'src/produk/entities/produk.entity';
import { Toko } from 'src/toko/entities/toko.entity';
import { MetodeTransaksi } from 'src/metode_transaksi/entities/metode_transaksi.entity';
import { DetilProdukPesanan } from 'src/detil_produk_pesanan/entities/detil_produk_pesanan.entity';

@Module({

  imports: [TypeOrmModule.forFeature([User, Role, Kategori, Produk, Toko, MetodeTransaksi, DetilProdukPesanan])],
  providers: [SeederService],
})
export class SeederModule {}
