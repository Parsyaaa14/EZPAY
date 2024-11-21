import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
import { Toko } from 'src/toko/entities/toko.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokoService } from 'src/toko/toko.service';
import { PassportModule } from '@nestjs/passport';
import { RolesGuard } from './guard/roles.guard';
import { JwtStrategy } from './guard/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User, Role, Toko]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret:
          configService.get<string>('JWT_SECRET') || 'your_default_jwt_secret',
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [AuthService, TokoService, RolesGuard, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtModule, AuthService, RolesGuard],
})
export class AuthModule {}
