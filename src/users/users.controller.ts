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
  Query,
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
    @Query('id_toko') idToko: string, // Pastikan ini menggunakan idToko
  ): Promise<User> {
    return this.usersService.tambahKasir(createUserKasirDto, idToko);
  }

  @Post('tambah-superadmin')
  async tambahSuperadmin(
    @Body() CreateSuperadminDto: CreateSuperadminDto,
  ): Promise<User> {
    return this.usersService.tambahSuperadmin(CreateSuperadminDto);
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
  async getAllKasir(@Query('id_toko') id_toko: string) {
    try {
      if (!id_toko) {
        throw new HttpException('id_toko is required', HttpStatus.BAD_REQUEST);
      }

      const kasirUsers = await this.usersService.findAllKasir(id_toko);
      return {
        data: kasirUsers.map((user) => ({
          id_kasir: user.id_user, // Sesuaikan dengan atribut Anda
          nama_kasir: user.nama,
          email_kasir: user.email,
          status: user.status,
        })),
      };
    } catch (error) {
      throw new HttpException(
        `Error fetching kasir users: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('list-kasir')
async listKasir(@Query('id_toko') id_toko: string) {
  return await this.usersService.getUsersByToko(id_toko);
}


  @Put('edit-kasir/:id_kasir')
  async editKasir(
    @Param('id_kasir', ParseUUIDPipe) id_kasir: string,
    @Body() editKasirDto: EditKasirDto,
  ): Promise<User> {
    // Panggil service untuk mengupdate kasir berdasarkan id
    return this.usersService.editKasir(id_kasir, editKasirDto);
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
