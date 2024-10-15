import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { TransaksiService } from './transaksi.service';
import { CreateTransaksiDto } from './dto/create-transaksi.dto';
import { UpdateTransaksiDto } from './dto/update-transaksi.dto';
import { Transaksi } from './entities/transaksi.entity';
import { BayarDto } from './dto/bayar-dto';
import { GetTransaksiFilterDto } from './dto/omset.dto';

@Controller('transaksi')
export class TransaksiController {
  constructor(private readonly transaksiService: TransaksiService) {}

  @Get()
  async getTransaksi(@Param('id') id: string) {
    return this.transaksiService.getTransaksi(id);
  }

  @Get('user/:id_user')
  async getTransaksiByUserId(@Param('id_user') id_user: string) {
    return this.transaksiService.findByUserId(id_user);
  }

  @Get('/all')
  async getAllTransaksi(
    @Query('startDate') startDate: string = '2000-01-01', // Default ke awal tahun 2000
    @Query('endDate') endDate: string = new Date().toISOString().split('T')[0], // Default ke tanggal hari ini
    @Query('page') page: number = 1, // Default halaman pertama
    @Query('limit') limit: number = 10 // Default 10 item per halaman
  ): Promise<{
    data: {
      id_transaksi: string; // ID transaksi
      jumlah_produk: number;
      totalHarga: number;
      createdAt: Date;
      metodeTransaksi: string[];
      user: {
        id_user: string; // ID pengguna
        nama: string; // Nama pengguna
      };
      produkDetail: {
        kode_produk: string; // Kode produk
        nama_produk: string; // Nama produk
        jumlah: number; // Jumlah produk
        harga: number; // Harga produk
        total: number; // Total harga produk
      }[];
    }[];
    total: number; // Total jumlah transaksi
    page: number; // Halaman saat ini
    limit: number; // Jumlah item per halaman
  }> {
    return this.transaksiService.getAllTransaksi(startDate, endDate, page, limit);
  }

  @Get('count')
  async getAllTransaksiCount(): Promise<{ jumlahTransaksi: number }> {
    const jumlahTransaksi = await this.transaksiService.getAllTransaksiCount();
    return { jumlahTransaksi };
  }

  @Get('total-harga')
  async getTotalHarga(
    @Query() filterDto: GetTransaksiFilterDto,
  ): Promise<number> {
    return this.transaksiService.getTotalHarga(filterDto);
  }

  @Get('monthly-sales') // Menentukan method GET
  async getMonthlySales() {
    return this.transaksiService.getMonthlySales();
  }

  // @Get('all')
  // async getAllTransaksiLong() {
  //   return this.transaksiService.getAllTransaksiLong();
  // }
  // @Get('all2')
  // async getAllTransaksiVeryLong() {
  //   return this.transaksiService.getAllTransaksiVeryLong();
  // }

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
