import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaksi } from './entities/transaksi.entity';
import { Pesanan } from 'src/pesanan/entities/pesanan.entity';
import { MetodeTransaksi } from 'src/metode_transaksi/entities/metode_transaksi.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TransaksiService {
  constructor(
    @InjectRepository(Transaksi)
    private readonly transaksiRepository: Repository<Transaksi>,
    @InjectRepository(Pesanan)
    private readonly pesananRepository: Repository<Pesanan>,
    @InjectRepository(MetodeTransaksi)
    private readonly metodeTransaksiRepository: Repository<MetodeTransaksi>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

<<<<<<< HEAD
=======
  async getLatestTransaksi(): Promise<any[]> {
    const transaksi = await this.transaksiRepository.find({
      relations: ['pesanan', 'pesanan.detilProdukPesanan', 'metodeTransaksi'],
      order: { createdAt: 'DESC' },
      take: 10,
    });
  
    return transaksi.map(t => {
      let jumlahProdukTotal = 0;
      if (t.pesanan && t.pesanan.detilProdukPesanan) {
        for (const detil of t.pesanan.detilProdukPesanan) {
          jumlahProdukTotal += detil.jumlah_produk;
        }
      }
  
      return {
        createdAt: t.createdAt,
        totalHarga: t.totalHarga,
        metodeTransaksi: t.metodeTransaksi,
        pesanan: t.pesanan,
        user: t.user,
      };
    });
  }

>>>>>>> bca59a6 (1)
  // async bayar(pesananId: string, metodeTransaksiId: string): Promise<Transaksi> {
  //   // Temukan pesanan
  //   const pesanan = await this.pesananRepository.findOne({
  //     where: { id_pesanan: pesananId },
  //     relations: ['user'], // Pastikan user termasuk dalam hasil pencarian
  //   });

  //   if (!pesanan) {
  //     throw new NotFoundException('Pesanan tidak ditemukan');
  //   }

  //   // Temukan metode transaksi
  //   const metodeTransaksi = await this.metodeTransaksiRepository.findOne({
  //     where: { id_metode_transaksi: metodeTransaksiId },
  //     relations: ['metode_transaksi'],
  //   });

  //   if (!metodeTransaksi) {
  //     throw new NotFoundException('Metode transaksi tidak ditemukan');
  //   }

  //   // Buat entitas transaksi baru
  //   const transaksi = this.transaksiRepository.create({
  //     metodeTransaksi: [metodeTransaksi],
  //     user: pesanan.user, // Hubungkan user dari pesanan
  //     pesanan: pesanan,   // Hubungkan dengan pesanan yang ada
  //     totalHarga: pesanan.total_harga_pesanan, // Total harga pesanan
  //   });

  //   // Simpan transaksi
  //   const savedTransaksi = await this.transaksiRepository.save(transaksi);

  //   // Update status pesanan jika diperlukan
  //   // pesanan.status_pesanan = 'selesai'; // Misalkan 'selesai' adalah status akhir dari pesanan
  //   await this.pesananRepository.save(pesanan);

  //   return savedTransaksi;
  // }
}
