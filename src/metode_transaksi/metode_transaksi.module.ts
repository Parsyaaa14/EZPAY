import { Module } from '@nestjs/common';
import { MetodeTransaksiService } from './metode_transaksi.service';
import { MetodeTransaksiController } from './metode_transaksi.controller';

@Module({
  controllers: [MetodeTransaksiController],
  providers: [MetodeTransaksiService]
})
export class MetodeTransaksiModule {}
