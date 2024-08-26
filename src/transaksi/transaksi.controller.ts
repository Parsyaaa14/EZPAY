import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransaksiService } from './transaksi.service';
import { CreateTransaksiDto } from './dto/create-transaksi.dto';
import { UpdateTransaksiDto } from './dto/update-transaksi.dto';

@Controller('transaksi')
export class TransaksiController {
  constructor(private readonly transaksiService: TransaksiService) {}

  @Post()
  create(@Body() createTransaksiDto: CreateTransaksiDto) {
    return this.transaksiService.create(createTransaksiDto);
  }

  @Get()
  findAll() {
    return this.transaksiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transaksiService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransaksiDto: UpdateTransaksiDto) {
    return this.transaksiService.update(+id, updateTransaksiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transaksiService.remove(+id);
  }
}
