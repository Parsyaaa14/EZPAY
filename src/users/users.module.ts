import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
import { RoleService } from 'src/role/role.service';
import { AuthModule } from 'src/auth/auth.module';
import { Toko } from 'src/toko/entities/toko.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [UsersController],
  providers: [UsersService, RoleService],
  exports: [UsersService, TypeOrmModule.forFeature([User, Role, AuthModule])], // Ekspor UserService dan TypeOrmModule
})
export class UsersModule {}
