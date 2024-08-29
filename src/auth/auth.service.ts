// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Fungsi login

  async login(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user;
    // TODO: Generate a JWT and return it here
    // instead of the user object
    return result;
  }


// async login(
//     email: string,
//     pass: string,
//   ): Promise<{ access_token: string }> {
//     const user = await this.usersService.findOne(email);
//     if (user?.password !== pass) {
//       throw new UnauthorizedException();
//     }
//     const payload = { sub: user.id_user, username: user.email };
//     return {
//       access_token: await this.jwtService.signAsync(payload),
//     };
//   }




  //   async login(email: string, password: string): Promise<{ access_token: string }> {
  //     // Cari user berdasarkan email
  //     const user = await this.usersService.findByEmail(email);

  //     // Validasi password
  //     const isPasswordValid = await bcrypt.compare(password, user.password);
  //     if (!isPasswordValid) {
  //       throw new UnauthorizedException('Email atau password salah');
  //     }

  //     // Buat payload untuk JWT
  //     const payload = { nama: user.nama, sub: user.id_user };

  //     // Return access token
  //     return {
  //       access_token: this.jwtService.sign(payload),
  //     };
  //   }
}
