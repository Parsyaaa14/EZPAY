import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PesananService } from './pesanan.service';
import { CreatePesananDto } from './dto/create-pesanan.dto';
import { UpdatePesananDto } from './dto/update-pesanan.dto';

@Controller('pesanan')
export class PesananController {
  constructor(private readonly pesananService: PesananService) {}

  @Post()
  create(@Body() createPesananDto: CreatePesananDto) {
    return this.pesananService.create(createPesananDto);
  }

  @Get()
  findAll() {
    return this.pesananService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pesananService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePesananDto: UpdatePesananDto) {
    return this.pesananService.update(+id, updatePesananDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pesananService.remove(+id);
  }
}
