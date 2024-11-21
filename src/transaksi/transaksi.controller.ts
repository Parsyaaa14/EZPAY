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
  HttpException,
  HttpStatus,
  UseGuards,
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
  async getTransaksiByUser(@Param('id_user') id_user: string) {
    return this.transaksiService.getTransaksiByUser(id_user);
  }

  @Get('user/:id_user')
  async getTransaksiByUserId(@Param('id_user') id_user: string) {
    return this.transaksiService.findByUserId(id_user);
  }

  @Get('/all')
  async getAllTransaksi(
    @Query('id_toko') idToko: string, // Tambahkan id_toko di sini
    @Query('startDate') startDate: string = '2000-01-01',
    @Query('endDate') endDate: string = new Date().toISOString().split('T')[0],
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{
    data: {
      id_transaksi: string;
      jumlah_produk: number;
      totalHarga: number;
      createdAt: Date;
      metodeTransaksi: string[];
      user: {
        id_user: string;
        nama: string;
      };
      produkDetail: {
        kode_produk: string;
        nama_produk: string;
        jumlah: number;
        harga: number;
        total: number;
      }[];
    }[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.transaksiService.getAllTransaksi(idToko, startDate, endDate, page, limit);
  }
  

  @Get('count')
  async getTransaksiCountByToko(@Query('id_toko') id_toko: string) {
    try {
      if (!id_toko) {
        throw new HttpException('id_toko is required', HttpStatus.BAD_REQUEST);
      }

      const jumlahTransaksi = await this.transaksiService.countTransaksiByToko(
        id_toko,
      );
      return {
        jumlahTransaksi,
      };
    } catch (error) {
      throw new HttpException(
        `Error fetching transaksi count: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('total-harga')
  // @UseGuards(JwtAuthGuard, RolesGuard) // Menggunakan guards untuk autentikasi dan peran
  // @Roles('Admin') // Hanya Admin yang bisa akses ini
  async getTotalHarga(
    @Query() filterDto: GetTransaksiFilterDto,
  ): Promise<number> {
    try {
      return await this.transaksiService.getTotalHarga(filterDto);
    } catch (error) {
      throw new HttpException(
        `Error fetching total harga: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('monthly-sales') // Menentukan method GET
  // @Roles('Admin') // Hanya Admin yang bisa akses ini
  async getMonthlySales(@Query('id_toko') idToko: string) {
    if (!idToko) {
      throw new HttpException('id_toko is required', HttpStatus.BAD_REQUEST);
    }
    return this.transaksiService.getMonthlySales(idToko);
  }

  @Get(':id_user')
  async getAllTransaksiKasirOnly(
    @Param('id_user') id_user: string, // Ambil id_user dari URL
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    // Pastikan id_user dikirim dengan benar ke service
    return await this.transaksiService.getAllTransaksiKasirOnly(id_user, startDate, endDate, page, limit);
  }
}