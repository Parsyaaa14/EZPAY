import { Controller, Get, Post, Body, Patch, Param, UseInterceptors, UploadedFile, HttpStatus, HttpException } from '@nestjs/common';
import { TokoService } from './toko.service';
import { DaftarDto } from './dto/daftar.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('toko')
export class TokoController {
  constructor(private readonly tokoService: TokoService) {}


  @Post('register')
  @UseInterceptors(
    FileInterceptor('foto', { // 'foto' should match the field name in the form
      storage: diskStorage({
        destination: './src/toko/foto', // Path to store uploaded files
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowTypes = ['image/png', 'image/jpg', 'image/jpeg'];
        if (!allowTypes.includes(file.mimetype)) {
          return cb(
            new HttpException('Invalid file type', HttpStatus.BAD_REQUEST),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 5, // max 5 MB
      },
    }),
  )
  async register(@Body() daftarDto: DaftarDto, @UploadedFile() file: Express.Multer.File) {
    try {
      if (file) {
        daftarDto.foto = file.filename; // Set file path or filename
      }
      return await this.tokoService.registerToko(daftarDto);
    } catch (error) {
      throw new Error(`Error registering toko: ${error.message}`);
    }
  }

  @Get('daftar')
  async getRegistrations() {
    return this.tokoService.getPendingRegistrations();
  }

  @Patch('register/:id/approve')

  async approveRegistration(@Param('id') id: number) {
    return this.tokoService.approveRegistration(id);
  }

  @Patch('register/:id/reject')
  async rejectRegistration(@Param('id') id: number) {
    return this.tokoService.rejectRegistration(id);
  }

  // @Post()
  // create(@Body() DaftarDto: DaftarDto) {
  //   return this.tokoService.create(DaftarDto);
  // }

  // @Get()
  // findAll() {
  //   return this.tokoService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.tokoService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTokoDto: UpdateTokoDto) {
  //   return this.tokoService.update(+id, updateTokoDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.tokoService.remove(+id);
  // }
}
