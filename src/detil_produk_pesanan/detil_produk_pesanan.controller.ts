import { Controller, Get, Post, Body, Put, Param, Delete, ParseUUIDPipe, HttpStatus } from '@nestjs/common';
import { DetilProdukPesananService } from './detil_produk_pesanan.service';
import { CreateDetilProdukPesananDto } from './dto/create-detil_produk_pesanan.dto';
import { UpdateDetilProdukPesananDto } from './dto/update-detil_produk_pesanan.dto';

@Controller('detil-produk-pesanan')
export class DetilProdukPesananController {
  constructor(private readonly detilProdukPesananService: DetilProdukPesananService) {}

  @Post()
  async create(@Body() CreateDetilProdukPesananDto: CreateDetilProdukPesananDto) {
    return {
      data: await this.detilProdukPesananService.create(CreateDetilProdukPesananDto),
      statusCode: HttpStatus.CREATED,
      message: 'success',
    };
  }

  @Get()
  async findAll() {
    const [data, count] = await this.detilProdukPesananService.findAll();

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
      data: await this.detilProdukPesananService.findOne(id),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDetilProdukPesananDto: UpdateDetilProdukPesananDto,
  ) {
    return {
      data: await this.detilProdukPesananService.update(id, updateDetilProdukPesananDto),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detilProdukPesananService.remove(+id);
  }
}
