import { Module } from '@nestjs/common';
import { TransaksiService } from './transaksi.service';
import { TransaksiController } from './transaksi.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaksi } from './entities/transaksi.entity';
import { Pesanan } from 'src/pesanan/entities/pesanan.entity';
import { MetodeTransaksi } from 'src/metode_transaksi/entities/metode_transaksi.entity';
import { MetodeTransaksiService } from 'src/metode_transaksi/metode_transaksi.service';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaksi, Pesanan, MetodeTransaksi, User]),
  ],
  controllers: [TransaksiController],
  providers: [TransaksiService, MetodeTransaksiService],
})
export class TransaksiModule {}
