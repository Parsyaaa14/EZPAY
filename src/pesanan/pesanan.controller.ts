import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PesananService } from './pesanan.service';
import { Pesanan } from './entities/pesanan.entity';
import { Transaksi } from 'src/transaksi/entities/transaksi.entity';

@Controller('pesanan')
export class PesananController {
  constructor(private readonly pesananService: PesananService) {}

  @Post()
  async createPesanan(@Body() pesananData: { 
    detil_produk_pesanan: { id_produk: string; jumlah_produk: number }[]; 
    metode_transaksi_id: string; 
    id_user: string; 
    id_toko: string; // Tambahkan id_toko di sini
  }): Promise<Transaksi> {
    return this.pesananService.savePesananAndTransaction(pesananData);
  }
  
}
