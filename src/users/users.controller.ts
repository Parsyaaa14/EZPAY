import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Patch,
  ParseUUIDPipe,
  HttpStatus,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateSuperadminDto } from './dto/create-superadmin.dto';
import { EditUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { CreateUserKasirDto } from './dto/create-usir-kasir.dto';
import { EditKasirDto } from './dto/update-kasir-dto';
import { EditPasswordDto } from './dto/edit-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string) {
    try {
      const user = await this.usersService.findByEmail(email);
      return user;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post('tambah-kasir')
  async tambahKasir(
    @Body() createUserKasirDto: CreateUserKasirDto,
  ): Promise<User> {
    return this.usersService.tambahKasir(createUserKasirDto);
  }

  @Post('tambah-admin')
  async tambahAdmin(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.tambahAdmin(createUserDto);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return {
      data: await this.usersService.create(createUserDto),
      statusCode: HttpStatus.CREATED,
      message: 'success',
    };
  }

  @Post('tambah-superadmin')
  async tambahSuperadmin(@Body() CreateSuperadminDto: CreateSuperadminDto): Promise<User> {
    return this.usersService.tambahSuperadmin(CreateSuperadminDto);
  }

  @Get('kasir')
  async getKasirUsers(): Promise<User[]> {
    return await this.usersService.getKasirUsers();
  }

  @Get()
  async findAll() {
    const [data, count] = await this.usersService.findAll();

    return {
      data,
      count,
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Get('kasir')
  async getAllKasir() {
    try {
      const kasirUsers = await this.usersService.findAllKasir();
      return {
        data: kasirUsers.map(user => ({
          id_kasir: user.id_user, // Sesuaikan dengan atribut Anda
          nama_kasir: user.nama,
          email_kasir: user.email,
          status: user.status,
        })),
      };
    } catch (error) {
      throw new HttpException(
        `Error fetching kasir users: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return {
      data: await this.usersService.findOne(id),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Put('edit-kasir/:id')
  async editKasir(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() editKasirDto: EditKasirDto,
  ): Promise<User> {
    // Panggil service untuk mengupdate kasir berdasarkan id
    return this.usersService.editKasir(id, editKasirDto);
  }

  @Put('edit-admin/:id')
  async editAdmin(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() editUserDto: EditUserDto,
  ): Promise<User> {
    // Panggil service untuk mengupdate kasir berdasarkan id
    return this.usersService.editAdmin(id, editUserDto);
  }
  @Patch('edit-password/:id')
  async editPassword(
    @Param('id') id: string,
    @Body() editKasirDto: EditKasirDto,
  ) {
    return this.usersService.editKasir(id, editKasirDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.usersService.remove(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }
}
