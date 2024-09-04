import { Module } from '@nestjs/common';
import { KategoriService } from './kategori.service';
import { KategoriController } from './kategori.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Kategori } from './entities/kategori.entity';
import { Produk } from 'src/produk/entities/produk.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Kategori, Produk])],
  controllers: [KategoriController],
  providers: [KategoriService]
})
export class KategoriModule {}
