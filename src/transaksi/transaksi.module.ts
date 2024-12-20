import { Module } from '@nestjs/common';
import { TransaksiService } from './transaksi.service';
import { TransaksiController } from './transaksi.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaksi } from './entities/transaksi.entity';
import { Pesanan } from 'src/pesanan/entities/pesanan.entity';
import { MetodeTransaksi } from 'src/metode_transaksi/entities/metode_transaksi.entity';
import { MetodeTransaksiService } from 'src/metode_transaksi/metode_transaksi.service';
import { User } from 'src/users/entities/user.entity';
import { DetilProdukPesanan } from 'src/detil_produk_pesanan/entities/detil_produk_pesanan.entity';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { Role } from 'src/role/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaksi, Pesanan, MetodeTransaksi, User, DetilProdukPesanan, Role]),JwtModule
  ],
  controllers: [TransaksiController],
  providers: [TransaksiService, MetodeTransaksiService, UsersService],
})
export class TransaksiModule {}
