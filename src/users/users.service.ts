import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateSuperadminDto } from './dto/create-superadmin.dto';
import { EditUserDto} from './dto/update-user.dto';
import { EntityNotFoundError, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/role/entities/role.entity';
import { EditKasirDto } from './dto/update-kasir-dto';
import { EditPasswordDto } from './dto/edit-password.dto';
import { CreateUserKasirDto } from './dto/create-usir-kasir.dto';

@Injectable()
export class UsersService {
  private readonly saltRounds = 10;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    ) {}
    private ubahSalt(): string {
      return bcrypt.genSaltSync();
    }
    
    private hashPassword(password: string, salt: string): string {
      return bcrypt.hashSync(password, salt); // Hash password with the generated salt
    }    
    
    private generateSalt(): string {
      return crypto.randomBytes(16).toString('hex');
    }
  
    async tambahKasir(createUserKasirDto: CreateUserKasirDto): Promise<User> {
      // Default password
      const password = '123456'; // Keep default password as plaintext
        
      // Get the 'Kasir' role
      const role = await this.roleRepository.findOne({
        where: { nama: 'Kasir' },
      });
    
      if (!role) {
        throw new Error('Role Kasir not found');
      }
    
      // Create a new user using the DTO
      const user = this.usersRepository.create({
        ...createUserKasirDto,
        password, // Save the default password as plaintext
        salt: '',  // No salt needed for plaintext password
        role,     // Assign the Kasir role
      });
    
      return this.usersRepository.save(user);
    }
    

  async tambahAdmin(createUserDto: CreateUserDto): Promise<User> {
    // Default password
    const password = '123';
    const salt = this.generateSalt();

    // Get the 'Admin' role
    const role = await this.roleRepository.findOne({
      where: { nama: 'Admin' },
    });

    if (!role) {
      throw new Error('Role Admin not found');
    }

    // Create a new user using the DTO
    const user = this.usersRepository.create({
      ...createUserDto,
      password, // Save the default password
      salt,     // Save the generated salt
      role,     // Assign the Admin role
    });

    return this.usersRepository.save(user);
  }

  async tambahSuperadmin(CreateSuperadminDto: CreateSuperadminDto): Promise<User> {
    if (!CreateSuperadminDto.password) {
      throw new Error('Password is required');
    }
  
    const salt = this.ubahSalt();
    const hashedPassword = this.hashPassword(CreateSuperadminDto.password, salt);
  
    // Check if email already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email: CreateSuperadminDto.email },
    });
  
    if (existingUser) {
      throw new Error('Email already exists');
    }
  
    const role = await this.roleRepository.findOne({
      where: { nama: 'SuperAdmin' },
    });
  
    if (!role) {
      throw new Error('Role SuperAdmin not found');
    }
  
    const user = this.usersRepository.create({
      ...CreateSuperadminDto,
      password: hashedPassword,
      salt,
      role,
    });
  
    return this.usersRepository.save(user);
  }
  
  
  async editKasir(id: string, editKasirDto: EditKasirDto): Promise<User> {
    const { nama, email, status, password } = editKasirDto;

    // Cari user berdasarkan id
    const user = await this.usersRepository.findOne({
      where: { id_user: id },
    });

    if (!user) {
      throw new NotFoundException(`User dengan id "${id}" tidak ditemukan`);
    }

    // Update atribut user
    if (nama) user.nama = nama;
    if (email) user.email = email;
    if (status !== undefined) user.status = status;

    // Jika password diberikan, buat salt baru dan hash password-nya
    if (password) {
      const salt = await bcrypt.genSalt(); // Generate salt baru
      user.salt = salt;
      user.password = await bcrypt.hash(password, salt);
    }

    // Simpan perubahan
    return await this.usersRepository.save(user);
  }


  async editPassword(id: string, editPasswordDto: EditPasswordDto): Promise<User> {
    const { email, password } = editPasswordDto;

    // Cari user berdasarkan id
    const user = await this.usersRepository.findOne({
      where: { id_user: id },
    });

    if (!user) {
      throw new NotFoundException(`User dengan id "${id}" tidak ditemukan`);
    }

    // Update email jika diberikan
    if (email) user.email = email;

    // Jika password diberikan, buat salt baru dan hash password-nya
    if (password) {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(password, salt);
    }

    // Simpan perubahan
    return await this.usersRepository.save(user);
  }

  async editAdmin(id: string, editUserDto: EditUserDto): Promise<User> {
    const { nama, email,no_handphone, status, password } = editUserDto;

    // Cari user berdasarkan id
    const user = await this.usersRepository.findOne({ where: { id_user: id } });

    if (!user) {
      throw new NotFoundException(`User dengan id "${id}" tidak ditemukan`);
    }

    // Update atribut user
    if (nama) user.nama = nama;
    if (email) user.email = email;
    if (no_handphone) user.no_handphone = no_handphone;
    if (status !== undefined) user.status = status;

    // Jika password diberikan, buat salt baru dan hash password-nya
    if (password) {
      const salt = await bcrypt.genSalt(); // Generate salt baru
      user.salt = salt;
      user.password = await bcrypt.hash(password, salt);
    }
    // user.status = !user.status;

    // Simpan perubahan
    return this.usersRepository.save(user);
  }

  
  // async findById(id: string): Promise<User | undefined> {
  //   return this.usersRepository.findOne({ where: { id_user: id } });
  // }

  async create(createUserDto: CreateUserDto) {
    const result = await this.usersRepository.insert(createUserDto);

    return this.usersRepository.findOneOrFail({
      where: {
        id_user: result.identifiers[0].id,
      },
    });
  }
  
  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }
  findAll() {
    return this.usersRepository.findAndCount();
  }


  async findAllKasir(): Promise<User[]> {
    // Mencari role "kasir"
    const kasirRole = await this.roleRepository.findOne({
      where: { nama: 'Kasir' }, // Ganti dengan field yang sesuai jika nama_role berbeda
    });
  
    if (!kasirRole) {
      throw new Error('Role kasir tidak ditemukan');
    }
  
    // Mencari semua pengguna dengan role "kasir"
    return this.usersRepository.find({
      where: {
        role: {
          id_role: kasirRole.id_role,
        },
      },
    });
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