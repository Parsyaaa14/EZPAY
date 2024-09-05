import { Controller, Get, Post, Body, Put, Param, Delete, HttpStatus, ParseUUIDPipe, Query, BadRequestException, HttpException, Res, Response } from '@nestjs/common';
import { KategoriService } from './kategori.service';
import { CreateKategoriDto } from './dto/create-kategori.dto';
import { UpdateKategoriDto } from './dto/update-kategori.dto';
import { Produk } from 'src/produk/entities/produk.entity';


@Controller('kategori')
export class KategoriController {
  constructor(private readonly kategoriService: KategoriService) {}

  @Post()
  async create(@Body() createKategoriDto: CreateKategoriDto) {
    return {
      data: await this.kategoriService.create(createKategoriDto),
      statusCode: HttpStatus.CREATED,
      message: 'success',
    };
  }


  @Get('/produk/:namaKategori')
  async getProdukByKategori(@Param('namaKategori') namaKategori: string): Promise<Produk[]> {
    return this.kategoriService.filterProdukByKategori(namaKategori);
  }

  // @Get('filter-produk/:namaKategori')
  // async filterProdukByKategori(@Param('namaKategori') namaKategori: string): Promise<Produk[]> {
  //   try {
  //     return await this.kategoriService.filterProdukByKategori(namaKategori);
  //   } catch (error) {
  //     throw new HttpException(
  //       `Gagal memfilter produk berdasarkan kategori: ${error.message}`,
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }
  // }


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
  async findOne(@Param('id', ParseUUIDPipe) id: string
  ){
    return {
      data: await this.kategoriService.findOne(id),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  // @Put(':id_kategori')
  // async updateNamaKategori(
  //   @Param('id_kategori') id_kategori: string,
  //   @Body() updateKategoriDto: UpdateKategoriDto,
  // ): Promise<void> {
  //   try {
  //     const { nama } = updateKategoriDto; // DTO akan mengandung input nama baru
  //     await this.kategoriService.updateNamaKategori(id_kategori, nama);
  //   } catch (error) {
  //     throw new HttpException(
  //       `Gagal memperbarui nama kategori: ${error.message}`,
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }

  @Put('update/:namaLama')
  async updateKategori(
    @Param('namaLama') namaLama: string,
    @Body() updateKategoriDto: UpdateKategoriDto,
  ): Promise<void> {
    try {
      await this.kategoriService.updateKategori(namaLama, updateKategoriDto);
    } catch (error) {
      throw new HttpException(
        `Gagal memperbarui kategori: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.kategoriService.remove(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }
}

