import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DetilProdukPesananService } from './detil_produk_pesanan.service';
import { CreateDetilProdukPesananDto } from './dto/create-detil_produk_pesanan.dto';
import { UpdateDetilProdukPesananDto } from './dto/update-detil_produk_pesanan.dto';

@Controller('detil-produk-pesanan')
export class DetilProdukPesananController {
  constructor(private readonly detilProdukPesananService: DetilProdukPesananService) {}

  @Post()
  create(@Body() createDetilProdukPesananDto: CreateDetilProdukPesananDto) {
    return this.detilProdukPesananService.create(createDetilProdukPesananDto);
  }

  @Get()
  findAll() {
    return this.detilProdukPesananService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detilProdukPesananService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetilProdukPesananDto: UpdateDetilProdukPesananDto) {
    return this.detilProdukPesananService.update(+id, updateDetilProdukPesananDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detilProdukPesananService.remove(+id);
  }
}
