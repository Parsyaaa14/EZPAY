import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpStatus,
  ParseUUIDPipe,
  Query,
  BadRequestException,
  HttpException,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { KategoriService } from './kategori.service';
import { CreateKategoriDto } from './dto/create-kategori.dto';
import { UpdateKategoriDto } from './dto/update-kategori.dto';
import { Produk } from 'src/produk/entities/produk.entity';
import { Kategori } from './entities/kategori.entity';
import { Toko } from 'src/toko/entities/toko.entity';

@Controller('kategori')
export class KategoriController {
  constructor(private readonly kategoriService: KategoriService) {}

  @Post()
  async create(
    @Body() createKategoriDto: CreateKategoriDto,
    @Query('id_toko') id_toko: string,
  ) {
    const kategori = await this.kategoriService.create(createKategoriDto, id_toko);
  
    return {
      data: kategori,
      statusCode: HttpStatus.CREATED,
      message: 'Kategori berhasil dibuat',
    };
  }
  
  @Get('by-kategori')
  async filterProdukByKategori(
    @Query('id_kategori') idKategori: string,
    @Query('id_toko') idToko: string,
  ): Promise<Produk[]> {
    return this.kategoriService.filterProdukByKategori(idKategori, idToko);
  }
  
// Di KategoriController
@Get('kategori-by-toko')
async findByToko(@Query('id_toko') id_toko: string) {
  if (!id_toko) {
    throw new HttpException('id_toko is required', HttpStatus.BAD_REQUEST);
  }
  const kategori = await this.kategoriService.kategoriByToko(id_toko);
  return {
    data: kategori,
    statusCode: HttpStatus.OK,
    message: 'Kategori ditemukan',
  };
}


  @Get()
  async findAll() {
    const [data, count] = await this.kategoriService.findAll();
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
      data: await this.kategoriService.findOne(id),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Get('/find-by-name')
  async findByName(@Query('nama') nama: string): Promise<{ data: Kategori }> {
    const kategori = await this.kategoriService.findByName(nama);
    if (!kategori) {
      throw new NotFoundException(
        `Kategori dengan nama ${nama} tidak ditemukan`,
      );
    }
    return { data: kategori };
  }

  @Put('update/:idKategori')
  async updateKategori(
    @Param('idKategori') idKategori: string,
    @Body() updateKategoriDto: UpdateKategoriDto,
  ): Promise<void> {
    try {
      await this.kategoriService.updateKategori(idKategori, updateKategoriDto);
    } catch (error) {
      throw new HttpException(
        `Gagal memperbarui kategori: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  
}
