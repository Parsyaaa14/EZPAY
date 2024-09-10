import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PesananService } from './pesanan.service';
import { Pesanan } from './entities/pesanan.entity';

@Controller('pesanan')
export class PesananController {
  constructor(private readonly pesananService: PesananService) {}

  @Post('save')
  async save(@Body() pesananData: { detil_produk_pesanan: { id_produk: string; jumlah_produk: number }[]; metode_transaksi_id: string; userId?: string }): Promise<Pesanan> {
    return this.pesananService.save(pesananData);
  }
}
