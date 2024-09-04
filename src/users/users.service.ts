import {
  HttpException,
  HttpStatus,
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityNotFoundError, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/role/entities/role.entity';

@Injectable()
export class UsersService {
  // private readonly kasirRoleId = "1"; // ID role Kasir, sesuaikan dengan database Anda

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async register(nama: string, password: string, email: string): Promise<User> {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      nama,
      password: hashedPassword,
      email,
    });

    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      // Handle jika email atau username sudah terdaftar
      if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
        throw new ConflictException('Username atau email sudah terdaftar');
      } else {
        throw new InternalServerErrorException('Terjadi kesalahan pada server');
      }
    }
  }

  // private generateRandomPassword(length: number): string {
  //   return crypto.randomBytes(length).toString('hex').slice(0, length);
  // }

  // private generateSalt(): string {
  //   return crypto.randomBytes(16).toString('hex');
  // }

  // async tambahKasir(
  //   nama: string,
  //   no_handphone: string,
  //   email: string,
  //   status: boolean,
  // ): Promise<User> {
  //   // Generate random password and salt
  //   const password = this.generateRandomPassword(12); // Adjust length as needed
  //   const salt = this.generateSalt();

  //   // Get the 'Kasir' role
  //   const role = await this.roleRepository.findOne({ where: { nama: 'Kasir' } });

  //   if (!role) {
  //     throw new Error('Role Kasir not found');
  //   }

  //   // Create a new user
  //   const user = this.usersRepository.create({
  //     nama,
  //     no_handphone,
  //     email,
  //     status,
  //     password, // Save the generated password
  //     salt,     // Save the generated salt
  //     role,     // Assign the Kasir role
  //   });

  //   return this.usersRepository.save(user);
  // }

  private generatePassword(): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }
    return password;
  }

  private hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto
      .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
      .toString('hex');
    return `${salt}:${hashedPassword}`;
  }

  async tambahKasir(
    nama: string,
    email: string,
    no_handphone: string,
  ): Promise<User> {
    // Ambil role kasir
    const role = await this.roleRepository.findOne({
      where: { nama: 'Kasir' },
    });
    if (!role) {
      throw new Error('Role Kasir tidak ditemukan');
    }

    // Generate password
    const rawPassword = this.generatePassword();
    const hashedPassword = this.hashPassword(rawPassword);

    // Buat user baru
    const newUser = this.usersRepository.create({
      nama,
      email,
      no_handphone,
      status: true,
      salt: hashedPassword.split(':')[0],
      password: hashedPassword.split(':')[1],
      role,
    });
    return await this.usersRepository.save(newUser);
  }

  async createAdmin(createUserDto: CreateUserDto): Promise<User> {
    // Cari role "Admin" dari database
    const adminRole = await this.roleRepository.findOne({
      where: { nama: 'Admin' },
    });
    if (!adminRole) {
      throw new NotFoundException('Role "Admin" tidak ditemukan');
    }

    // Buat user baru berdasarkan data dari DTO
    const user = this.usersRepository.create(createUserDto);

    // Tetapkan role sebagai Admin
    user.role = adminRole;

    // Simpan user ke database
    return await this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(
        `User dengan email ${email} tidak ditemukan.`,
      );
    }
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const result = await this.usersRepository.insert(createUserDto);

    return this.usersRepository.findOneOrFail({
      where: {
        id_user: result.identifiers[0].id,
      },
    });
  }

  findAll() {
    return this.usersRepository.findAndCount();
  }

  async findOne(id: string) {
    try {
      return await this.usersRepository.findOneOrFail({
        where: {
          id_user: id,
        },
      });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw e;
      }
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      await this.usersRepository.findOneOrFail({
        where: {
          id_user: id,
        },
      });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw e;
      }
    }

    await this.usersRepository.update(id, updateUserDto);

    return this.usersRepository.findOneOrFail({
      where: {
        id_user: id,
      },
    });
  }

  async remove(id: string) {
    try {
      await this.usersRepository.findOneOrFail({
        where: {
          id_user: id,
        },
      });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw e;
      }
    }

    await this.usersRepository.delete(id);
  }
}
