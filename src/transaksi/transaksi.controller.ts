import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { TransaksiService } from './transaksi.service';
import { CreateTransaksiDto } from './dto/create-transaksi.dto';
import { UpdateTransaksiDto } from './dto/update-transaksi.dto';
import { Transaksi } from './entities/transaksi.entity';
import { BayarDto } from './dto/bayar-dto';

@Controller('transaksi')
export class TransaksiController {
  constructor(private readonly transaksiService: TransaksiService) {}

  // @Post('bayar')
  // async bayar(@Body() body: {
  //   pesananId: string;
  //   metodeTransaksiId: string;
  // }): Promise<Transaksi> {
  //   try {
  //     const { pesananId, metodeTransaksiId } = body;
  //     return await this.transaksiService.bayar(pesananId, metodeTransaksiId);
  //   } catch (error) {
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // @Post('bayar')
  // async bayar(@Body() bayarDto: BayarDto): Promise<Transaksi> {
  //   return this.transaksiService.bayar(bayarDto);
  // }

  //   @Post('bayar')
  // async bayar(@Body() bayarDto: BayarDto) {
  //   return this.transaksiService.bayar(bayarDto);
  // }

  // @Post()
  // create(@Body() createTransaksiDto: CreateTransaksiDto) {
  //   return this.transaksiService.create(createTransaksiDto);
  // }

  // @Get()
  // findAll() {
  //   return this.transaksiService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.transaksiService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTransaksiDto: UpdateTransaksiDto) {
  //   return this.transaksiService.update(+id, updateTransaksiDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.transaksiService.remove(+id);
  // }
}
