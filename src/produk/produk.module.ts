import { Module } from '@nestjs/common';
import { ProdukService } from './produk.service';
import { ProdukController } from './produk.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produk } from './entities/produk.entity';
import { Kategori } from 'src/kategori/entities/kategori.entity';
import { User } from 'src/users/entities/user.entity';
import { Toko } from 'src/toko/entities/toko.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Produk,Kategori,User,Toko])],
  controllers: [ProdukController],
  providers: [ProdukService]
})
export class ProdukModule {}
