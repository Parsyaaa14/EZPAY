import { Module } from '@nestjs/common';
import { MetodeTransaksiService } from './metode_transaksi.service';
import { MetodeTransaksiController } from './metode_transaksi.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetodeTransaksi } from './entities/metode_transaksi.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MetodeTransaksi])],
  controllers: [MetodeTransaksiController],
  providers: [MetodeTransaksiService]
})
export class MetodeTransaksiModule {}
