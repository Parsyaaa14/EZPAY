import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PesananService } from './pesanan.service';
import { Pesanan } from './entities/pesanan.entity';
import { Transaksi } from 'src/transaksi/entities/transaksi.entity';

@Controller('pesanan')
export class PesananController {
  constructor(private readonly pesananService: PesananService) {}

  // @Post('save')
  // async save(@Body() pesananData: { detil_produk_pesanan: { id_produk: string; jumlah_produk: number }[]; metode_transaksi_id: string; userId?: string }): Promise<Pesanan> {
  //   return this.pesananService.save(pesananData);
  // }

  @Post()
  async createPesanan(@Body() pesananData: { 
    detil_produk_pesanan: { id_produk: string; jumlah_produk: number }[]; 
    metode_transaksi_id: string; 
    token: string; // Token yang diterima dari permintaan
  }): Promise<Transaksi> {
    return this.pesananService.savePesananAndTransaction(pesananData);
  }
}
