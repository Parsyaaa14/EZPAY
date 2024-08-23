import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { User } from '#/users/entities/user.entity';
import { Role } from '#/role/entities/role.entity';
import { Kategori } from '#/kategori/entities/kategori.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Kategori])],
  providers: [SeederService],
})
export class SeederModule {}
