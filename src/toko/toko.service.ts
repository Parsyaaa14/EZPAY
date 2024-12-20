import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RoleEnum } from 'src/users/entities/role.enum';
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

  async createTokoWithAdmin(adminDto: CreateUserDto, tokoDto: CreateTokoDto) {
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
      foto, // Menyimpan nama file yang diunggah
      status: StatusToko.PENDING, // Status toko default adalah PENDING
      user: [newAdmin], // Hubungkan toko dengan admin yang baru dibuat
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
  async approveToko(id_toko: string, status: StatusToko) {
    const toko = await this.tokoRepository.findOne({
      where: { id_toko },
      relations: ['users'], // Relasi dengan users (plural)
    });

    if (!toko) {
      throw new BadRequestException('Toko tidak ditemukan');
    }

    if (status !== StatusToko.APPROVED && status !== StatusToko.REJECTED) {
      throw new BadRequestException('Status tidak valid');
    }

    toko.status = status;
    await this.tokoRepository.save(toko);

    // Mencari user dengan role Admin dari array users
    const adminUser = toko.user.find((user) => user.role.nama === RoleEnum.ADMIN);

    if (!adminUser) {
      throw new BadRequestException('Admin tidak ditemukan untuk toko ini');
    }

    return {
      message: `Toko ${toko.nama_toko} berhasil di-${
        status === StatusToko.APPROVED ? 'approve' : 'reject'
      }`,
      toko: {
        ...toko,
        pemilik: {
          nama_user: adminUser.nama,
          email: adminUser.email,
          no_handphone: adminUser.no_handphone,
        },
      },
    };
  }

  async getTokoByUserId(id_user: string): Promise<{ user: User; toko: Toko }> {
    const userWithToko = await this.userRepository.findOne({
      where: { id_user }, // Pastikan ini menggunakan nama kolom yang benar
      relations: ['toko'], // Sertakan relasi 'toko' untuk memuat data toko terkait
    });
  
    if (!userWithToko || !userWithToko.toko) {
      throw new Error('Toko not found for this user');
    }
  
    return {
      user: userWithToko,
      toko: userWithToko.toko, // Mengembalikan informasi toko
    };
  }
  async getTokoByStatus(status: any) {
    return this.tokoRepository.find({
      where: { status }, // Filter berdasarkan status
      relations: ['user'], // Pastikan relasi dengan user diambil
    });
  }

  async setPendingToko(id_toko: string) {
    const toko = await this.tokoRepository.findOne({ where: { id_toko } });

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
