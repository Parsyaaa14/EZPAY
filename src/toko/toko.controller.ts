import {
  Controller,
  Patch,
  Param,
  Body,
  BadRequestException,
  Post,
  ConflictException,
  Put,
  Get,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { TokoService } from './toko.service'; // Import service Toko
import { StatusToko } from './entities/toko.entity'; // Import enum StatusToko
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('toko')
export class TokoController {
  constructor(private readonly tokoService: TokoService) {}
  @Post('create-with-admin')
  @UseInterceptors(
    FileInterceptor('foto', {
      storage: diskStorage({
        destination: './public/gambar_toko',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowTypes = ['image/png', 'image/jpg', 'image/jpeg'];
        if (!allowTypes.includes(file.mimetype)) {
          return cb(new BadRequestException('Invalid file type'), false);
        }
        cb(null, true);
      },
    }),
  )
  async createTokoWithAdmin(
    @UploadedFile() file: Express.Multer.File,
    @Body() createTokoDto: any, // Gunakan tipe `any` untuk parsing manual
  ) {
    // Parse manual adminDto dan tokoDto dari string ke JSON
    const { adminDto, tokoDto } = createTokoDto;
  
    const parsedAdminDto = JSON.parse(adminDto);
    const parsedTokoDto = JSON.parse(tokoDto);
  
    // Tambahkan file foto jika ada
    if (file) {
      parsedTokoDto.foto = file.filename;
    }
  
    try {
      const result = await this.tokoService.createTokoWithAdmin(parsedAdminDto, parsedTokoDto);
      return {
        message: result.message,
        toko: result.toko,
        admin: result.admin,
      };
    } catch (error) {
      console.error('Error creating toko with admin:', error);
      throw new BadRequestException(error.message || 'Terjadi kesalahan saat membuat toko dan admin');
    }
  }
  

  @Get('approved/with-user')
  async getApprovedTokoWithUser() {
    return this.tokoService.getApprovedTokoWithUser();
  }

  @Put(':id_toko/reject')
  async rejectToko(
    @Param('id_toko') id_toko: string
  ) {
    return this.tokoService.approveToko(id_toko, StatusToko.REJECTED);
  }

  @Get('pending')
  async getPendingToko() {
    return this.tokoService.getTokoByStatus('pending');
  }

  @Get('daftar')

  async getRegistrations() {
    return this.tokoService.getPendingRegistrations();
  }

  @Get('approved')
  async getApprovedToko() {
    const tokos = await this.tokoService.getApprovedToko();
    console.log(tokos); // Periksa output di konsol
    return tokos;
  }

  @Patch('register/:id/approve')
  async approveRegistration(@Param('id') id: number) {
    return this.tokoService.approveRegistration(id);
  }

  @Patch('register/:id/reject')
  async rejectRegistration(@Param('id') id: number) {
    return this.tokoService.rejectRegistration(id);
  }
}
