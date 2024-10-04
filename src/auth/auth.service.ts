import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { StatusToko, Toko } from 'src/toko/entities/toko.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Toko)
    private readonly tokoRepository: Repository<Toko>,
    private readonly jwtService: JwtService, // Inject JwtService
  ) {
    this.jwtSecret = process.env.JWT_SECRET || 'your_default_jwt_secret';
    console.log('JWT_SECRET:', this.jwtSecret); // Log untuk memastikan JWT_SECRET terbaca
  }

  async loginForKasir(
    email: string,
    password: string,
  ): Promise<{ access_token?: string; redirectUrl?: string; alert?: string }> {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['role'], // Ensure role is loaded
    });

    if (!user) {
      throw new UnauthorizedException('Email tidak ditemukan');
    }

    // Cek apakah role adalah 'kasir'
    if (user.role.nama !== 'Kasir') {
      throw new UnauthorizedException('Akses ditolak: Anda bukan kasir');
    }

    // Cek apakah status kasir adalah INACTIVE
    if (user.status === 'tidak aktif') {
      throw new UnauthorizedException(
        'Akses ditolak: Akun Anda sedang tidak aktif',
      );
    }

    // Jika password yang diinput adalah default '123456', arahkan user ke endpoint edit-password
    if (password === '123456' && !user.password.includes('$2b$')) {
      return {
        alert: 'Anda perlu mengubah password Anda',
        redirectUrl: `/edit_password_kasir?id=${user.id_user}`, // Menggunakan path yang benar
      };
    }

    // Jika password sudah diubah, hash password-nya
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Password salah');
    }

    user.lastLogin = new Date();
    await this.usersRepository.save(user);

    // Buat payload JWT
    const payload = {
      email: user.email,
      sub: user.id_user,
      iat: Math.floor(Date.now() / 1000), // Add issued at (current time in seconds)
    };
    
    const access_token = this.jwtService.sign(payload);
    // Kembalikan token dan redirectUrl jika password diubah
    return {
      access_token,
      redirectUrl:
        user.password === '123456'
          ? `/edit_password_kasir?id=${user.id_user}`
          : undefined,
    };
  }

  async validateUser(token: string): Promise<User> {
    try {
      const payload = this.jwtService.verify(token);
      // Assuming the payload has an id_user property
      return await this.usersRepository.findOne({
        where: { id_user: payload.id_user },
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async validateToko(email: string, password: string) {
    // Cari user berdasarkan email
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Akun tidak ditemukan');
    }

    // Validasi password user
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Password salah');
    }

    // Cari toko yang terkait dengan user tersebut, gunakan user.id_user
    const toko = await this.tokoRepository.findOne({
      where: { user: { id_user: user.id_user } },
    });

    if (!toko) {
      throw new UnauthorizedException('Toko tidak ditemukan untuk user ini');
    }

    // Cek status toko
    if (toko.status === StatusToko.PENDING) {
      throw new ForbiddenException(
        'Akun Anda masih dalam proses persetujuan. Harap tunggu.',
      );
    }

    if (toko.status === StatusToko.REJECTED) {
      return { redirect: '/toko-rejected-page' }; // Ganti '/toko-rejected-page' dengan path yang sesuai
    }

    // Generate JWT token
    const payload = { email: user.email, sub: user.id_user };
    const accessToken = this.jwtService.sign(payload);

    if (accessToken) {
      console.log(
        `Toko ${toko.nama_toko} berhasil login dengan status ${toko.status}`,
      );
    }

    return { message: 'Login berhasil', accessToken };
  }

  async loginForSuperadmin(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['role'], // Ensure role is loaded
    });

    if (!user) {
      throw new UnauthorizedException('Email tidak ditemukan');
    }

    // Verifikasi password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Password salah');
    }

    // Cek apakah role adalah 'Superadmin'
    if (user.role.nama !== 'SuperAdmin') {
      throw new UnauthorizedException('Akses ditolak: Anda bukan Superadmin');
    }

    // Buat payload JWT
    const payload = { email: user.email, sub: user.id_user };

    // Generate token JWT
    const access_token = this.jwtService.sign(payload);

    // Pengecekan tambahan jika diperlukan
    if (access_token) {
      console.log(`User ${user.email} berhasil login dengan role Superadmin.`);
    }

    return { access_token };
  }
}

// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import * as bcrypt from 'bcrypt';
// import * as jwt from 'jsonwebtoken';
// import { User } from 'src/users/entities/user.entity';

// @Injectable()
// export class AuthService {
//   private readonly jwtSecret: string;

//   constructor(
//     @InjectRepository(User)
//     private readonly usersRepository: Repository<User>,
//   ) {
//     this.jwtSecret = process.env.JWT_SECRET || 'your_default_jwt_secret';
//   }

//   async login(email: string, password: string): Promise<{ access_token: string }> {
//     const user = await this.usersRepository.findOne({ where: { email } });

//     if (!user) {
//       throw new UnauthorizedException('Password atau email salah');
//     }

//     // Verifikasi password
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       throw new UnauthorizedException('Password atau email salah');
//     }

//     // Buat payload JWT
//     const payload = { email: user.email, sub: user.id_user };

//     // Generate token JWT
//     const access_token = jwt.sign(payload, this.jwtSecret, { expiresIn: '1h' });

//     return { access_token };
//   }
// }
