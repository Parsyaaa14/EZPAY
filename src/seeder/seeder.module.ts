import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { User } from '#/users/entities/user.entity';
import { Role } from '#/role/entities/role.entity';
import { Kategori } from '#/kategori/entities/kategori.entity';
import { Produk } from '#/produk/entities/produk.entity';
import { Toko } from '#/toko/entities/toko.entity';

@Module({

  imports: [TypeOrmModule.forFeature([User, Role, Kategori, Produk, Toko])],
  providers: [SeederService],
})
export class SeederModule {}
