import { Module } from '@nestjs/common';
import { TransaksiService } from './transaksi.service';
import { TransaksiController } from './transaksi.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaksi } from './entities/transaksi.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaksi])],
  controllers: [TransaksiController],
  providers: [TransaksiService]
})
export class TransaksiModule {}
