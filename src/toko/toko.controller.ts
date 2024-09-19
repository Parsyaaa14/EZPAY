import { Controller, Patch, Param, Body, BadRequestException, Post, ConflictException, Put,Get, NotFoundException } from '@nestjs/common';
import { TokoService } from './toko.service'; // Import service Toko
import { StatusToko } from './entities/toko.entity'; // Import enum StatusToko
import { CreateUserDto } from './dto/admin.dto';
import { CreateTokoDto } from './dto/toko.dto';

@Controller('toko')
export class TokoController {
  constructor(private readonly tokoService: TokoService) {}

  @Post('create-with-admin')
  async createTokoWithAdmin(
    @Body() createTokoDto: { adminDto: CreateUserDto; tokoDto: CreateTokoDto },
  ) {
    const { adminDto, tokoDto } = createTokoDto;

    try {
      const result = await this.tokoService.createTokoWithAdmin(adminDto, tokoDto);
      return {
        message: result.message,
        toko: result.toko,
        admin: result.admin,
      };
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Terjadi kesalahan saat membuat toko dan admin');
    }
  }

  // Endpoint untuk meng-approve toko
  @Put(':id_toko/approve')
  async approveToko(
    @Param('id_toko') idToko: string,
    @Body() body: { status: StatusToko },
  ) {
    const { status } = body;
    if (status !== StatusToko.APPROVED && status !== StatusToko.REJECTED) {
      throw new BadRequestException('Status tidak valid');
    }
    
    const result = await this.tokoService.approveToko(idToko, status);
    if (!result) {
      throw new NotFoundException('Toko tidak ditemukan');
    }
    
    return result;
  }

  // Endpoint untuk menolak toko
  @Put(':id_toko/reject')
  async rejectToko(
    @Param('id_toko') id_toko: string
  ) {
    return this.tokoService.approveToko(id_toko, StatusToko.REJECTED);
  }

  // Endpoint untuk mengatur status toko ke pending
  @Put(':id_toko/set-pending')
  async setPendingToko(
    @Param('id_toko') id_toko: string
  ) {
    return this.tokoService.setPendingToko(id_toko);
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
}










// import { Controller, Get, Post, Body, Patch, Param, UseInterceptors, UploadedFile, HttpStatus, HttpException } from '@nestjs/common';
// import { TokoService } from './toko.service';
// import { DaftarDto } from './dto/daftar.dto';
// import { diskStorage } from 'multer';
// import { extname } from 'path';
// import { FileInterceptor } from '@nestjs/platform-express';


// @Controller('toko')
// export class TokoController {
//   constructor(private readonly tokoService: TokoService) {}


//   @Post('register')
//   @UseInterceptors(
//     FileInterceptor('foto', { // 'foto' should match the field name in the form
//       storage: diskStorage({
//         destination: './src/toko/foto', // Path to store uploaded files
//         filename: (req, file, cb) => {
//           const uniqueName = `${Date.now()}${extname(file.originalname)}`;
//           cb(null, uniqueName);
//         },
//       }),
//       fileFilter: (req, file, cb) => {
//         const allowTypes = ['image/png', 'image/jpg', 'image/jpeg'];
//         if (!allowTypes.includes(file.mimetype)) {
//           return cb(
//             new HttpException('Invalid file type', HttpStatus.BAD_REQUEST),
//             false,
//           );
//         }
//         cb(null, true);
//       },
//       limits: {
//         fileSize: 1024 * 1024 * 5, // max 5 MB
//       },
//     }),
//   )
//   // async register(@Body() daftarDto: DaftarDto, @UploadedFile() file: Express.Multer.File) {
//   //   try {
//   //     if (file) {
//   //       daftarDto.foto = file.filename; // Set file path or filename
//   //     }
//   //     return await this.tokoService.registerToko(daftarDto);
//   //   } catch (error) {
//   //     throw new Error(`Error registering toko: ${error.message}`);
//   //   }
//   // }



//   @Patch('register/:id/approve')

//   async approveRegistration(@Param('id') id: number) {
//     return this.tokoService.approveRegistration(id);
//   }

//   @Patch('register/:id/reject')
//   async rejectRegistration(@Param('id') id: number) {
//     return this.tokoService.rejectRegistration(id);
//   }


// }
