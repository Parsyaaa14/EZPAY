import {
  HttpException,
  HttpStatus,
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
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
  private readonly saltRounds = 10;

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


 
  private generateRandomPassword(length: number): string {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
  }

  private generateSalt(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }


  private async generateSaltNew(): Promise<string> {
    return bcrypt.genSalt(this.saltRounds);
  }

  async tambahKasir(
    nama: string,
    // no_handphone: string,
    email: string,
    status: boolean,
  ): Promise<User> {
    // Generate random password and salt
    const password = this.generateRandomPassword(4); // Adjust length as needed
    const salt = this.generateSalt();

    // Get the 'Kasir' role
    const role = await this.roleRepository.findOne({ where: { nama: 'Kasir' } });

    if (!role) {
      throw new Error('Role Kasir not found');
    }

    // Create a new user
    const user = this.usersRepository.create({
      nama,
      // no_handphone,
      email,
      status,
      password, // Save the generated password
      salt,     // Save the generated salt
      role,     // Assign the Kasir role
    });

    return this.usersRepository.save(user);
  }

  async tambahAdmin(
    nama: string,
    no_handphone: string,
    email: string,
    status: boolean,
  ): Promise<User> {
    // Generate random password and salt
    const password = this.generateRandomPassword(4); // Adjust length as needed
    const salt = this.generateSalt();

    // Get the 'Kasir' role
    const role = await this.roleRepository.findOne({ where: { nama: 'Admin' } });

    if (!role) {
      throw new Error('Role Kasir not found');
    }

    // Create a new user
    const user = this.usersRepository.create({
      nama,
      no_handphone,
      email,
      status,
      password, // Save the generated password
      salt,     // Save the generated salt
      role,     // Assign the Kasir role
    });

    return this.usersRepository.save(user);
  }

 
  async editPassword(userId: string, newPassword: string): Promise<User> {
    // Validasi panjang password
    if (newPassword.length < 8) {
      throw new BadRequestException('Password should be at least 8 characters long');
    }

    // Generate salt dan hash password baru
    const salt = await this.generateSaltNew();
    const hashedPassword = await this.hashPassword(newPassword, salt);

    // Cari pengguna berdasarkan ID
    const user = await this.usersRepository.findOne({ where: { id_user: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update password dan salt pengguna
    user.password = hashedPassword;
    user.salt = salt;

    // Simpan pengguna yang diperbarui
    return this.usersRepository.save(user);
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
