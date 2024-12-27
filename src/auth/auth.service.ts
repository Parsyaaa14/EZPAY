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

  async generateToken(payload: any): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (err) {
      throw new Error('Token tidak valid');
    }
  }

  async loginForKasir(
    email: string,
    password: string,
  ): Promise<{ access_token?: string; id_user?: string; nama?: string; id_toko?: string; email?: string; nama_role?: string }> {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['role', 'toko'],  // Pastikan relasi toko dimuat
    });
  
    if (!user) {
      throw new UnauthorizedException('Email tidak ditemukan');
    }
  
    // Cek apakah password default digunakan
    if (password === '123456') {
      // Password default, hanya kirimkan data user tanpa token
      if (!user.toko) {
        throw new UnauthorizedException('Toko tidak ditemukan untuk pengguna ini');
      }
      return {
        id_user: user.id_user,
        nama: user.nama,
        email: user.email,
        id_toko: user.toko.id_toko,  // Toko terkait dengan user
        nama_role: user.role.nama,  // Tambahkan nama_role
      };
    }
  
    // Cek apakah password yang diinput cocok dengan hash di database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Password salah');
    }
  
    // Validasi peran dan status akun
    if (user.role.nama !== 'Kasir') {
      throw new UnauthorizedException('Akses ditolak: Anda bukan kasir');
    }
  
    if (user.status === 'tidak aktif') {
      throw new UnauthorizedException({
        message: 'Akun Anda sedang tidak aktif',
        statusCode: 401,
      });
    }
  
    // Simpan waktu login terakhir dan buat token JWT
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
  
    if (!toko) {
      throw new UnauthorizedException('Toko tidak ditemukan untuk pengguna ini');
    }
  
    const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });
  
    return {
      access_token,
      id_user: user.id_user,
      nama: user.nama,
      id_toko: toko.id_toko,  // Kirim id_toko yang terkait
      email: user.email,
      nama_role: user.role.nama,  // Tambahkan nama_role
    };
  }
  
  
  async validateUser(token: string): Promise<User> {
    const payload = this.jwtService.verify(token);
    console.log('Payload:', payload);
    try {
      // Assuming the payload has an id_user property
      return await this.usersRepository.findOne({
        where: { id_user: payload.sub },
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async validateToko(email: string, password: string) {
    // Find the user by email and include the role relationship
    const user = await this.usersRepository.findOne({ 
        where: { email },
        relations: ['role'] // Include the role relation
    });
  
    if (!user) {
        throw new UnauthorizedException('Akun tidak ditemukan');
    }
  
    // Validate user's password
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
        throw new UnauthorizedException('Password salah');
    }

    const userWithRole = await this.usersRepository.findOne({
      where: { id_user: user.id_user },
      relations: ['role'], // Pastikan nama relasi sesuai
    });
  
    if (!userWithRole) {
      throw new Error('User not found');
    }


  
    // Find the store associated with the user
    const toko = await this.tokoRepository.findOne({
        where: { user: { id_user: user.id_user } }
    });
  
    if (!toko) {
        throw new UnauthorizedException('Toko tidak ditemukan untuk user ini');
    }
  
    // Check the store's status
    if (toko.status === StatusToko.PENDING) {
        throw new ForbiddenException(
            'Akun Anda masih dalam proses persetujuan. Harap tunggu.'
        );
    }
  
    if (toko.status === StatusToko.REJECTED) {
        return { redirect: '/toko-rejected-page' }; // Redirect if store is rejected
    }

    // Check if the user has the role 'Admin'
    if (user.role.nama !== 'Admin') {
        throw new UnauthorizedException('Akses ditolak: Anda bukan admin');
    }
  
    // Generate JWT token
    const payload = {
        email: user.email,
        sub: userWithRole.id_user,
        role: userWithRole.role.nama, // Ambil nama role
        id_toko: toko.id_toko, // Add id_toko to the JWT payload
        iat: Math.floor(Date.now() / 1000)
    };
    const access_token = this.jwtService.sign(payload);
  
    console.log(`Toko ${toko.nama_toko} berhasil login dengan status ${toko.status}`);
  
    // Return login result including user and id_toko
    return {
        message: 'Login berhasil',
        access_token,
        user: {
            id_user: user.id_user,
            email: user.email,
            nama: user.nama,
            nama_role: user.role.nama // Include the role name
        },
        id_toko: toko.id_toko // Return id_toko
    };
}

  async loginForSuperadmin(
    email: string,
    password: string,
  ): Promise<{ access_token: string; nama_role: string }> {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['role'], // Ensure the 'role' relation is loaded
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
  
    // Return access_token dan nama_role
    return { access_token, nama_role: user.role.nama };
  }
  
}
