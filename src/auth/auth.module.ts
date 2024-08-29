// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { UsersService } from '#/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '#/users/entities/user.entity';
// import { JwtStrategy } from '../jwt.strategy'; // Jika menggunakan JWT strategy

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: 'secretKey', // Ganti dengan secret key yang aman
      signOptions: { expiresIn: '60m' }, // Expiry token 60 menit
    }),TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthService,JwtService, UsersService],
  controllers: [AuthController],
})
export class AuthModule {}
