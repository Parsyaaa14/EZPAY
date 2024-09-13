import { Module } from '@nestjs/common';
import { TokoService } from './toko.service';
import { TokoController } from './toko.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Toko } from './entities/toko.entity';
import { Produk } from 'src/produk/entities/produk.entity';
import { Pesanan } from 'src/pesanan/entities/pesanan.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Toko,Produk,Pesanan,User])],
  controllers: [TokoController],
  providers: [TokoService]
})
export class TokoModule {}
