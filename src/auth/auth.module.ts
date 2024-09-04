// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { RoleService } from 'src/role/role.service';
import { Role } from 'src/role/entities/role.entity';

// import { JwtStrategy } from '../jwt.strategy'; // Jika menggunakan JWT strategy

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: 'secretKey', // Ganti dengan secret key yang aman
      signOptions: { expiresIn: '60m' }, // Expiry token 60 menit
    }),TypeOrmModule.forFeature([User, Role]),
  ],
  providers: [AuthService,JwtService, UsersService, RoleService],
  controllers: [AuthController],
})
export class AuthModule {}
