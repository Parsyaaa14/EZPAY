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
  UseInterceptors,
  HttpException,
  UploadedFile,
  Query,
  BadRequestException,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { ProdukService } from './produk.service';
import { CreateProdukDto } from './dto/create-produk.dto';
import { UpdateProdukDto } from './dto/update-produk.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { Produk } from './entities/produk.entity';
import * as fs from 'fs';
import * as path from 'path';
import { join } from 'path/posix';
import { of } from 'rxjs';

@Controller('produk')
export class ProdukController {
  produkRepository: any;
  constructor(private readonly produkService: ProdukService) {}


  @Post()
  @UseInterceptors(
    FileInterceptor('gambar_produk', {
      storage: diskStorage({
        destination: './uploads/products',
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
        fileSize: 1024 * 1024 * 5, // Maks 5 MB
      },
    }),
  )
  async createProduk(
    @Body() createProdukDto: CreateProdukDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      if (file) {
        createProdukDto.gambar_produk = file.filename;
      }
      console.log("Menerima CreateProdukDto di controller:", createProdukDto); // Debugging
      return await this.produkService.createProduk(createProdukDto);
    } catch (error) {
      throw new Error(`Error membuat produk: ${error.message}`);
    }
  }
  

  // @Public()
  @Get('/image/:image')
  getImage(@Param('image') image: string, @Res() res: any){
    return of(res.sendFile(join(process.cwd(), `uploads/products/${image}`)));
  }

  @Get('filter-stok')
  async filterProduk(): Promise<Produk[]> {
    return this.produkService.filterProdukMinStok();
  }

  // @Get('filter')
  // async filterProdukkategori(@Query('kategori') kategori: string): Promise<Produk[]> {
  //   if (!kategori) {
  //     throw new BadRequestException('Kategori parameter is missing');
  //   }

  //   return this.produkService.filterProdukByKategori(kategori);
  // }

  @Get('all')
  async findAll() {
    const [data, count] = await this.produkService.findAll();

    return {
      data,
      count,
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Get('count')
  async getAllProduk(): Promise<{ jumlahProduk: number }> {
    const jumlah = await this.produkService.getAllProduk();
    return { jumlahProduk: jumlah };
  }

  @Get('by-harga')
  async getProdukByHarga(
    @Query('sort') sort: 'ASC' | 'DESC',
    @Query('kategori') kategori?: string,
  ): Promise<Produk[]> {
    return await this.produkService.getProdukByHarga(sort, kategori);
  }
  @Get('search')
  async searchProduk(
    @Query('nama_produk') nama_produk: string,
  ): Promise<Produk[]> {
    return this.produkService.searchProduk(nama_produk);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return {
      data: await this.produkService.findOne(id),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  // @Put(':id')
  // // async update(
  // //   @Param('id', ParseUUIDPipe) id: string,
  // //   @Body() updateProdukDto: UpdateProdukDto,
  // // ): Promise<Produk> {
  // //   return this.produkService.update(id, updateProdukDto);
  // // }
  // async update(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body() updateProdukDto: UpdateProdukDto,
  // ) {
  //   return {
  //     data: await this.produkService.update(id, updateProdukDto),
  //     statusCode: HttpStatus.OK,
  //     message: 'success',
  //   };
  // }

  @Put(':nama_produk')
  @UseInterceptors(
    FileInterceptor('gambar_produk', {
      storage: diskStorage({
        destination: './uploads/products', // The destination for uploaded images
        filename: (req, file, cb) => {
          const fileName = `${Date.now()}-${file.originalname}`;
          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowTypes = ['image/png', 'image/jpg', 'image/jpeg'];
        if (!allowTypes.includes(file.mimetype)) {
          return cb(
            new HttpException('invalid file type', HttpStatus.BAD_REQUEST),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 5, // maks 5 mb
      },
    }),
  )
  async updateProduk(
    @Param('nama_produk') id_produk: string,
    @Body() updateProdukDto: UpdateProdukDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Produk> {
    try {
      const produk = await this.produkService.findOne(id_produk); // Find the product by its name or ID

      if (!produk) {
        throw new NotFoundException('Produk tidak ditemukan');
      }

      // Jika ada file gambar baru, hapus gambar lama dan perbarui gambar di DTO
      if (file) {
        if (produk.gambar_produk) {
          const oldImagePath = path.join(
            __dirname,
            '..',
            'uploads/products/',
            produk.gambar_produk,
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath); // Hapus gambar lama
          }
        }
        updateProdukDto.gambar_produk = file.filename; // Simpan nama file baru
      }

      return await this.produkService.updateProduk(
        id_produk,
        updateProdukDto,
      );
    } catch (error) {
      throw new HttpException(
        `Gagal memperbarui produk: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.produkService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }
}
