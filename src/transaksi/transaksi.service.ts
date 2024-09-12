import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaksi } from './entities/transaksi.entity';
import { Pesanan } from 'src/pesanan/entities/pesanan.entity';
import { MetodeTransaksi } from 'src/metode_transaksi/entities/metode_transaksi.entity';
import { User } from 'src/users/entities/user.entity';
import { DetilProdukPesanan } from 'src/detil_produk_pesanan/entities/detil_produk_pesanan.entity';

@Injectable()
export class TransaksiService {
  constructor(
    @InjectRepository(Transaksi)
    private readonly transaksiRepository: Repository<Transaksi>,
  ) {}


  async getTransaksi(id: string): Promise<Transaksi> {
    return this.transaksiRepository.findOne({
      where: { id_transaksi: id },
      relations: ['pesanan', 'pesanan.detilProdukPesanan', 'metodeTransaksi'],
    });
  }


  async getAllTransaksi(): Promise<{
    jumlah_produk: number;
    totalHarga: number;
    createdAt: Date;
    metodeTransaksi: string[];
  }[]> {
    const transaksiList = await this.transaksiRepository
      .createQueryBuilder('transaksi')
      .leftJoinAndSelect('transaksi.pesanan', 'pesanan')
      .leftJoinAndSelect('pesanan.detilProdukPesanan', 'detilProdukPesanan')
      .leftJoinAndSelect('transaksi.metodeTransaksi', 'metodeTransaksi')
      .orderBy('transaksi.createdAt', 'DESC')
      .take(10)
      .getMany();

    return transaksiList.map((transaksi) => {
      const jumlahProduk = transaksi.pesanan.detilProdukPesanan.reduce(
        (acc, detil) => acc + detil.jumlah_produk,
        0,
      );

      const metodeTransaksi = transaksi.metodeTransaksi.map(
        (metode) => metode.nama, // Pastikan ada field nama_metode di entitas MetodeTransaksi
      );

      return {
        jumlah_produk: jumlahProduk,
        totalHarga: transaksi.totalHarga,
        createdAt: transaksi.createdAt,
        metodeTransaksi,
      };
    });
  }

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
