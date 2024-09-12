import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TokoService } from './toko.service';
import { CreateTokoDto } from './dto/create-toko.dto';
import { UpdateTokoDto } from './dto/update-toko.dto';

@Controller('toko')
export class TokoController {
  constructor(private readonly tokoService: TokoService) {}

  @Post()
  create(@Body() createTokoDto: CreateTokoDto) {
    return this.tokoService.create(createTokoDto);
  }

  @Get()
  findAll() {
    return this.tokoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tokoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTokoDto: UpdateTokoDto) {
    return this.tokoService.update(+id, updateTokoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tokoService.remove(+id);
  }
}
