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
import * as Cookies from 'cookies';

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
  ): Promise<{ access_token?: string; redirectUrl?: string; id_user?: string; nama?: string; id_toko?: string, email?: string }> {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['role'],
    });
  
    if (!user) {
      throw new UnauthorizedException('Email tidak ditemukan');
    }
  
    // 1. Cek apakah password default digunakan
    if (password === '123456') {
      return {
        redirectUrl: '/edit_password_kasir?id=${user.id_user}',
      };
    }
  
    // 2. Cek apakah password yang diinput cocok dengan hash di database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Password salah');
    }
  
    // 3. Validasi peran dan status akun
    if (user.role.nama !== 'Kasir') {
      throw new UnauthorizedException('Akses ditolak: Anda bukan kasir');
    }
  
    if (user.status === 'tidak aktif') {
      throw new UnauthorizedException({
        message: 'Akun Anda sedang tidak aktif',
        statusCode: 401,
      });
    }
  
    // 4. Simpan waktu login terakhir dan buat token JWT
    user.lastLogin = new Date();
    await this.usersRepository.save(user);
  
    const payload = {
      email: user.email,
      sub: user.id_user,
      iat: Math.floor(Date.now() / 1000),
    };
  
    // Cari toko yang terkait dengan user tersebut
    const toko = await this.tokoRepository.findOne({
    where: { user: { id_user: user.id_user } },
      });
    const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });
  
    return {
      access_token,
      id_user: user.id_user, // Mengembalikan id_user
      nama: user.nama, // Mengembalikan nama
      id_toko: toko.id_toko,// Mengembalikan id_toko
      email: user.email,
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
  
    // Cari toko yang terkait dengan user tersebut
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
      return { redirect: '/toko-rejected-page' }; // Redirect jika toko ditolak
    }
  
    // Generate JWT token
    const payload = {
      email: user.email,
      sub: user.id_user,
      id_toko: toko.id_toko, // Tambahkan id_toko ke payload JWT
      iat: Math.floor(Date.now() / 1000),
    };
    const access_token = this.jwtService.sign(payload);
  
    console.log('Toko ${toko.nama_toko} berhasil login dengan status ${toko.status}');
  
    // Kembalikan hasil login termasuk user dan id_toko
    return {
      message: 'Login berhasil',
      access_token,
      user: { id_user: user.id_user, email: user.email, nama: user.nama },
      id_toko: toko.id_toko, // Kembalikan id_toko
    };
  }
  

  // async validateToko(
  //   email: string,
  //   password: string,
  //   res: Response,
  //   req: Request,
  // ): Promise<{ message: string; access_token?: string; redirect?: string }> {
  //   // Cari user berdasarkan email
  //   const user = await this.usersRepository.findOne({ where: { email } });

  //   if (!user) {
  //     throw new UnauthorizedException('Akun tidak ditemukan');
  //   }

  //   // Validasi password user
  //   const passwordIsValid = await bcrypt.compare(password, user.password);
  //   if (!passwordIsValid) {
  //     throw new UnauthorizedException('Password salah');
  //   }

  //   // Cari toko yang terkait dengan user tersebut
  //   const toko = await this.tokoRepository.findOne({
  //     where: { user: { id_user: user.id_user } },
  //   });

  //   if (!toko) {
  //     throw new UnauthorizedException('Toko tidak ditemukan untuk user ini');
  //   }

  //   // Cek status toko
  //   switch (toko.status) {
  //     case StatusToko.PENDING:
  //       throw new ForbiddenException(
  //         'Akun Anda masih dalam proses persetujuan. Harap tunggu.',
  //       );
  //     case StatusToko.REJECTED:
  //       return { message: 'Akun Anda ditolak', redirect: '/toko-rejected-page' }; // Ganti '/toko-rejected-page' dengan path yang sesuai
  //   }

  //   // Generate JWT token
  //   const payload = {
  //     email: user.email,
  //     sub: user.id_user,
  //   }; // Sub digunakan untuk menyimpan ID pengguna
  //   const access_token = this.jwtService.sign(payload); // iat ditambahkan otomatis

  //   // Menyimpan token dan informasi pengguna ke cookies
  //   const cookies = new Cookies(req, res);
  //   cookies.set('accessToken', access_token, { httpOnly: true }); // hapus secure: true
  //   cookies.set('userEmail', user.email, { httpOnly: true });
  //   cookies.set('id_user', user.id_user.toString(), { httpOnly: true });
  //   // Logging
  //   if (access_token) {
  //     console.log(Toko ${toko.nama_toko} berhasil login dengan status ${toko.status});
  //   }

  //   return { message: 'Login berhasil', access_token };
  // }

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
      console.log('User ${user.email} berhasil login dengan role Superadmin.');
    }

    return { access_token };
  }
}
