// auth.module.ts
// auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; // Pastikan path sesuai dengan modul Users Anda
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
import { Toko } from 'src/toko/entities/toko.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Toko]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_default_jwt_secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}