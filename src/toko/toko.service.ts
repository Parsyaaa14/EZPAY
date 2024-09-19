import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from 'src/users/entities/user.entity';
import { Toko, StatusToko } from './entities/toko.entity';
import { Role } from 'src/role/entities/role.entity';
import { CreateTokoDto } from './dto/toko.dto';
import { CreateUserDto } from './dto/admin.dto';

@Injectable()
export class TokoService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Toko)
    private readonly tokoRepository: Repository<Toko>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async createTokoWithAdmin(
    adminDto: CreateUserDto,
    tokoDto: CreateTokoDto,
  ) {
    const { nama, email, no_handphone, password } = adminDto;
    const { nama_toko, alamat_toko, deskripsi_toko, foto } = tokoDto;
  
    // Cek apakah user dengan email ini sudah ada
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User dengan email ini sudah ada');
    }
  
    // Cek apakah toko dengan nama ini sudah ada
    const existingToko = await this.tokoRepository.findOne({
      where: { nama_toko },
    });
    if (existingToko) {
      throw new ConflictException('Toko dengan nama ini sudah ada');
    }
  
    // Ambil role Admin dari database
    const roleAdmin = await this.roleRepository.findOne({
      where: { nama: 'Admin' },
    });
    if (!roleAdmin) {
      throw new BadRequestException('Role Admin tidak ditemukan');
    }
  
    // Buat user admin baru
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
  
    const newAdmin = this.userRepository.create({
      nama,
      email,
      no_handphone,
      password: hashedPassword,
      salt,
      role: roleAdmin, // Assign role admin
    });
  
    await this.userRepository.save(newAdmin);
  
    // Buat toko baru dan hubungkan dengan admin
    const newToko = this.tokoRepository.create({
      nama_toko,
      alamat_toko,
      deskripsi_toko,
      foto,
      status: StatusToko.PENDING, // Status toko default adalah PENDING
      user: newAdmin, // Hubungkan toko dengan admin yang baru dibuat
    });
  
    await this.tokoRepository.save(newToko);
  
    return {
      message: 'Toko dan Admin berhasil dibuat. Toko menunggu persetujuan.',
      toko: newToko,
      admin: newAdmin,
    };
  }

  async getApprovedTokoWithUser() {
    return this.tokoRepository
      .createQueryBuilder('toko')
      .leftJoinAndSelect('toko.user', 'user')
      .where('toko.status = :status', { status: 'approved' })
      .getMany();
  }
  

  // Method untuk SuperAdmin approve/reject toko
  // async approveToko(id_toko: string, status: StatusToko) {
  //   const toko = await this.tokoRepository.findOne({
  //     where: { id_toko },});

  //   if (!toko) {
  //     throw new BadRequestException('Toko tidak ditemukan');
  //   }

  //   if (status !== StatusToko.APPROVED && status !== StatusToko.REJECTED) {
  //     throw new BadRequestException('Status tidak valid');
  //   }

  //   toko.status = status;
  //   await this.tokoRepository.save(toko);

  //   return {
  //     message: `Toko ${toko.nama_toko} berhasil di-${
  //       status === StatusToko.APPROVED ? 'approve' : 'reject'
  //     }`,
  //   };
  // }

  async approveToko(id_toko: string, status: StatusToko) {
    const toko = await this.tokoRepository.findOne({
      where: { id_toko },
      relations: ['user'], // Pastikan relasi dengan User diambil
    });

    if (!toko) {
      throw new BadRequestException('Toko tidak ditemukan');
    }

    if (status !== StatusToko.APPROVED && status !== StatusToko.REJECTED) {
      throw new BadRequestException('Status tidak valid');
    }

    toko.status = status;
    await this.tokoRepository.save(toko);

    return {
      message: `Toko ${toko.nama_toko} berhasil di-${
        status === StatusToko.APPROVED ? 'approve' : 'reject'
      }`,
      toko: {
        ...toko,
        pemilik: {
          nama_user: toko.user.nama,
          email: toko.user.email,
          no_handphone: toko.user.no_handphone,
        },
      },
    };
  }

  async setPendingToko(id_toko: string) {
    const toko = await this.tokoRepository.findOne({ where: { id_toko },});

    if (!toko) {
      throw new BadRequestException('Toko tidak ditemukan');
    }

    toko.status = StatusToko.PENDING;
    await this.tokoRepository.save(toko);

    return {
      message: `Toko ${toko.nama_toko} berhasil di-set ke status pending`,
    };
  }
  async getPendingRegistrations() {
    return this.tokoRepository.find({ where: { status: StatusToko.PENDING } });
  }
  async getApprovedToko(): Promise<Toko[]> {
    return this.tokoRepository.find({
      where: { status: StatusToko.APPROVED },
      relations: ['user'], // Hubungkan dengan tabel user
    });
  }
  async approveRegistration(id: number) {
    return this.tokoRepository.update(id, { status: StatusToko.APPROVED });
  }

  async rejectRegistration(id: number) {
    return this.tokoRepository.update(id, { status: StatusToko.REJECTED });
  }
  
}

// import { Injectable } from '@nestjs/common';
// import { DaftarDto } from './dto/daftar.dto';
// // import { UpdateTokoDto } from './dto/update-toko.dto';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { StatusToko, Toko } from './entities/toko.entity';
// import * as bcrypt from 'bcrypt';

// @Injectable()
// export class TokoService {
//   constructor(
//     @InjectRepository(Toko)
//     private tokoRepository: Repository<Toko>,
//   ) {}

//   // async registerToko(daftarDto: DaftarDto) {
//   //   const { nama, email, no_handphone, password, nama_toko, deskripsi_toko, alamat_toko, foto } = daftarDto;

//   //   // Hash password
//   //   const hashedPassword = await bcrypt.hash(password, 10);

//   //   const newToko = this.tokoRepository.create({
//   //     nama,
//   //     email,
//   //     no_handphone,
//   //     password: hashedPassword,
//   //     nama_toko,
//   //     deskripsi_toko,
//   //     alamat_toko,
//   //     foto,
//   //     status: StatusToko.PENDING, // Set status to pending
//   //   });

//   //   return this.tokoRepository.save(newToko);
//   // }






// }
