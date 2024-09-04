import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { CreateUserKasirDto } from './dto/create-usir-kasir.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(
    @Body('nama') nama: string,
    @Body('password') password: string,
    @Body('email') email: string,
  ) {
    return this.usersService.register(nama, password, email);
  }

  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string) {
    try {
      const user = await this.usersService.findByEmail(email);
      return user;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }




  @Post('/tambah-kasir')
  async tambahKasir(
    @Body() createUserKasirDto: CreateUserKasirDto
  ): Promise<User> {
    return this.usersService.tambahKasir(
      createUserKasirDto.nama,
      // createUserKasirDto.no_handphone,
      createUserKasirDto.email,
      createUserKasirDto.status
    );
  }

 

  @Post('/tambah-admin')
  async tambahAdmin(
    @Body() createUserKasirDto: CreateUserDto
  ): Promise<User> {
    return this.usersService.tambahKasir(
      createUserKasirDto.nama,
      createUserKasirDto.email,
      createUserKasirDto.status
    );
  }

  @Put('edit-password/:id')
  async editPassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('newPassword') newPassword: string,
  ): Promise<User> {
    return this.usersService.editPassword(id, newPassword);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return {
      data: await this.usersService.create(createUserDto),
      statusCode: HttpStatus.CREATED,
      message: 'success',
    };
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

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return {
      data: await this.usersService.findOne(id),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return {
      data: await this.usersService.update(id, updateUserDto),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
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
