// auth.module.ts
// auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; // Pastikan path sesuai dengan modul Users Anda
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/role/entities/role.entity';

@Module({
  // imports: [
  //   UsersModule,
  //   JwtModule.register({
  //     secret: 'your_jwt_secret', // Ganti dengan secret yang Anda gunakan
  //     signOptions: { expiresIn: '1h' }, // Konfigurasi waktu kadaluwarsa token
  //   }),
  // ],
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_default_jwt_secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, UsersService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}


// import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { AuthService } from './auth.service';
// import { User } from 'src/users/entities/user.entity';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([User]),
//     JwtModule.register({
//       secret: process.env.JWT_SECRET || 'your_default_jwt_secret',
//       signOptions: { expiresIn: '1h' },
//     }),
//   ],
//   providers: [AuthService],
//   exports: [AuthService],
// })
// export class AuthModule {}






// import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from 'src/users/entities/user.entity';
// import { UsersService } from 'src/users/users.service';
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';
// import { RoleService } from 'src/role/role.service';
// import { Role } from 'src/role/entities/role.entity';

// @Module({
//   imports: [
//     JwtModule.register({
//       secret: process.env.JWT_SECRET || 'default_secret_key',
//       signOptions: { expiresIn: '1h' },
//     }),
//     TypeOrmModule.forFeature([User, Role]), // Import UserRepository
//   ],
//   providers: [AuthService, UsersService, RoleService],
//   controllers: [AuthController],
//   exports: [AuthService],
// })
// export class AuthModule {}
