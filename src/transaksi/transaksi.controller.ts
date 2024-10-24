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
    @Query('limit') limit: number = 10, // Default 10 item per halaman
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
    return this.transaksiService.getAllTransaksi(
      startDate,
      endDate,
      page,
      limit,
    );
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
  async getMonthlySales(@Query('id_toko') idToko: string) {
    if (!idToko) {
      throw new HttpException('id_toko is required', HttpStatus.BAD_REQUEST);
    }
    return this.transaksiService.getMonthlySales(idToko);
  }
}
