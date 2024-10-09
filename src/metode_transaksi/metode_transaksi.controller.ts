import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MetodeTransaksiService } from './metode_transaksi.service';
import { CreateMetodeTransaksiDto } from './dto/create-metode_transaksi.dto';
import { UpdateMetodeTransaksiDto } from './dto/update-metode_transaksi.dto';

@Controller('metode-transaksi')
export class MetodeTransaksiController {
  constructor(private readonly metodeTransaksiService: MetodeTransaksiService) {}

  @Post()
  create(@Body() createMetodeTransaksiDto: CreateMetodeTransaksiDto) {
    return this.metodeTransaksiService.create(createMetodeTransaksiDto);
  }

  @Get()
  async getAll() {
    return this.metodeTransaksiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.metodeTransaksiService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMetodeTransaksiDto: UpdateMetodeTransaksiDto) {
    return this.metodeTransaksiService.update(+id, updateMetodeTransaksiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.metodeTransaksiService.remove(+id);
  }
}
