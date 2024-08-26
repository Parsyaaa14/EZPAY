import { Module } from '@nestjs/common';
import { PesananService } from './pesanan.service';
import { PesananController } from './pesanan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pesanan } from './entities/pesanan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pesanan])],
  controllers: [PesananController],
  providers: [PesananService]
})
export class PesananModule {}
