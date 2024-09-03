import { Module } from '@nestjs/common';
import { ProdukService } from './produk.service';
import { ProdukController } from './produk.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produk } from './entities/produk.entity';
import { Kategori } from 'src/kategori/entities/kategori.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Produk,Kategori])],
  controllers: [ProdukController],
  providers: [ProdukService]
})
export class ProdukModule {}
