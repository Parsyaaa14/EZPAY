import { Module } from '@nestjs/common';
import { TransaksiService } from './transaksi.service';
import { TransaksiController } from './transaksi.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaksi } from './entities/transaksi.entity';
import { Pesanan } from 'src/pesanan/entities/pesanan.entity';
import { MetodeTransaksi } from 'src/metode_transaksi/entities/metode_transaksi.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaksi, Pesanan, MetodeTransaksi]),
  ],
  controllers: [TransaksiController],
  providers: [TransaksiService]
})
export class TransaksiModule {}
