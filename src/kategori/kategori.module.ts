import { Module } from '@nestjs/common';
import { KategoriService } from './kategori.service';
import { KategoriController } from './kategori.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Kategori } from './entities/kategori.entity';
import { Produk } from 'src/produk/entities/produk.entity';
import { Toko } from 'src/toko/entities/toko.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Kategori, Produk, Toko])],
  controllers: [KategoriController],
  providers: [KategoriService]
})
export class KategoriModule {}
