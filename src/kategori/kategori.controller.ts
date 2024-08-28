import { Controller, Get, Post, Body, Put, Param, Delete, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { KategoriService } from './kategori.service';
import { CreateKategoriDto } from './dto/create-kategori.dto';
import { UpdateKategoriDto } from './dto/update-kategori.dto';


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

  @Put(':id')
  async update(
   @Param('id', ParseUUIDPipe) id: string,
   @Body() updateKategoriDto: UpdateKategoriDto 
  ) {
    return {
      data: await this.kategoriService.update(id, updateKategoriDto),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
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

