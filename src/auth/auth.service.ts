import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService, // Inject JwtService
  ) {
    this.jwtSecret = process.env.JWT_SECRET || 'your_default_jwt_secret';
  }

  async loginForKasir(email: string, password: string): Promise<{ access_token: string }> {
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

    // Cek apakah role adalah 'kasir'
    if (user.role.nama !== 'Kasir') {
      throw new UnauthorizedException('Akses ditolak: Anda bukan kasir');
    }

    // Buat payload JWT
    const payload = { email: user.email, sub: user.id_user };

    // Generate token JWT
    const access_token = this.jwtService.sign(payload);

    return { access_token };
  }

  async loginForAdmin(email: string, password: string): Promise<{ access_token: string }> {
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

    // Cek apakah role adalah 'admin'
    if (user.role.nama !== 'Admin') {
      throw new UnauthorizedException('Akses ditolak: Anda bukan admin');
    }

    // Buat payload JWT
    const payload = { email: user.email, sub: user.id_user };

    // Generate token JWT
    const access_token = this.jwtService.sign(payload);

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