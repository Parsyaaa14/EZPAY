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
  InternalServerErrorException,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProdukService } from './produk.service';
import { CreateProdukDto } from './dto/create-produk.dto';
import { UpdateProdukDto } from './dto/update-produk.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { Produk, StatusProduk } from './entities/produk.entity';
import * as fs from 'fs';
import * as path from 'path';
import { join } from 'path/posix';
import { of } from 'rxjs';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard'; // Impor JwtAuthGuard

@Controller('produk')
export class ProdukController {
  produkRepository: any;
  constructor(private readonly produkService: ProdukService) {}

  @Post('tambah-produk') // Endpoint untuk menambah produk
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
    @Query('id_toko') idToko: string, // Ambil id_toko dari query
    @Body() createProdukDto: CreateProdukDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Produk> {
    try {
      if (file) {
        createProdukDto.gambar_produk = file.filename; // Simpan nama file di DTO
      }
      return await this.produkService.createProduk(createProdukDto, idToko); // Memanggil service dengan dua argumen
    } catch (error) {
      throw new InternalServerErrorException(
        `Error membuat produk: ${error.message}`,
      );
    }
  }

  @Get('by-kategori')
  async filterProdukByKategori(
    @Query('id_kategori') idKategori: string,
    @Query('id_toko') idToko: string,
  ): Promise<Produk[]> {
    return this.produkService.filterProdukByKategori(idKategori, idToko);
  }

  @Get('/toko/:id_toko')
  async getProductsByToko(@Param('id_toko') id_toko: string) {
    try {
      const products = await this.produkService.findProductsByToko(id_toko);
      return products; // Mengembalikan produk dengan kategori sebagai objek
    } catch (error) {
      console.error('Error fetching products for toko:', error);
      throw new InternalServerErrorException(
        'Failed to fetch products for toko',
      );
    }
  }

  // @Public()
  @Get('/filter-min-stok/toko/:id_toko')
  @UseGuards(JwtAuthGuard, RolesGuard) // Gunakan JwtAuthGuard untuk melindungi endpoint
  @Roles('Admin') // Menggunakan dekorator untuk role
  async getFilteredProdukMinStok(@Param('id_toko') id_toko: string) {
    try {
      const produk = await this.produkService.filterProdukMinStok(id_toko);
      return produk;
    } catch (error) {
      console.error('Error fetching filtered products for toko:', error);
      throw new InternalServerErrorException(
        'Failed to fetch filtered products for toko',
      );
    }
  }

  @Get('/image/:image')
  getImage(@Param('image') image: string, @Res() res: any) {
    return of(res.sendFile(join(process.cwd(), `uploads/products/${image}`)));
  }

  @Get('filter-by-user')
  async getFilteredProdukByUser(
    @Query('id_user') id_user: string, // Mengambil id_user dari URL
    @Query('sort') sort: 'ASC' | 'DESC' = 'ASC', // Default sort adalah ASC
  ): Promise<Produk[]> {
    // Validasi id_user dan sort
    if (!id_user) {
      throw new BadRequestException('id_user harus diisi');
    }
    if (sort !== 'ASC' && sort !== 'DESC') {
      throw new BadRequestException('Sort harus ASC atau DESC');
    }

    return this.produkService.filterProdukByUser(id_user, sort);
  }

  @Get('count')
  async getCount(@Query('id_toko') id_toko: string): Promise<number> {
    return await this.produkService.getAllProduk(id_toko);
  }

  @Get('by-harga')
  async getProdukByHarga(
    @Query('sort') sort: 'ASC' | 'DESC',
    @Query('id_toko') id_toko: string,
  ): Promise<Produk[]> {
    return this.produkService.getProdukByHarga(sort, id_toko);
  }

  @Get('by-stok')
  async getProdukByStok(
    @Query('sort') sort: 'ASC' | 'DESC',
    @Query('id_toko') id_toko: string,
  ): Promise<Produk[]> {
    return this.produkService.getProdukByStok(sort, id_toko);
  }

  @Get('/aktif')
  async findAllAktif(
    @Query('status') status?: StatusProduk,
    @Query('id_toko') id_toko?: string,
  ): Promise<Produk[]> {
    try {
      const products = await this.produkService.findAllAktif(status, id_toko);
      return products;
    } catch (error) {
      console.error('Error fetching active products:', error);
      throw new InternalServerErrorException('Failed to fetch active products');
    }
  }

  @Get('/search')
  async searchProduk(
    @Query('nama_produk') nama_produk: string,
    @Query('id_toko') id_toko: string,
  ): Promise<Produk[]> {
    try {
      const products = await this.produkService.searchProduk(
        nama_produk,
        id_toko,
      );
      return products;
    } catch (error) {
      console.error('Error searching for products:', error);
      throw new InternalServerErrorException('Failed to search for products');
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return {
      data: await this.produkService.findOne(id),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

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

      return await this.produkService.updateProduk(id_produk, updateProdukDto);
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
