import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pesanan } from './entities/pesanan.entity';
import { DetilProdukPesanan } from 'src/detil_produk_pesanan/entities/detil_produk_pesanan.entity';
import { Produk } from 'src/produk/entities/produk.entity';
import { MetodeTransaksi } from 'src/metode_transaksi/entities/metode_transaksi.entity';
import { User } from 'src/users/entities/user.entity'; // Tambahkan import untuk User

@Injectable()
export class PesananService {
  constructor(
    @InjectRepository(Pesanan)
    private readonly pesananRepository: Repository<Pesanan>,
    @InjectRepository(DetilProdukPesanan)
    private readonly detilProdukPesananRepository: Repository<DetilProdukPesanan>,
    @InjectRepository(Produk)
    private readonly produkRepository: Repository<Produk>,
    @InjectRepository(MetodeTransaksi)
    private readonly metodeTransaksiRepository: Repository<MetodeTransaksi>,
    @InjectRepository(User) // Tambahkan inject repository untuk User jika diperlukan
    private readonly userRepository: Repository<User>, 
  ) {}

  async save(pesananData: {
    detil_produk_pesanan: { id_produk: string; jumlah_produk: number }[];
    metode_transaksi_id: string;
    userId?: string; // Optional jika ingin menyimpan user yang melakukan pesanan
  }): Promise<Pesanan> {
    // Temukan metode transaksi
    const metodeTransaksi = await this.metodeTransaksiRepository.findOne({
      where: { id_metode_transaksi : pesananData.metode_transaksi_id },
    });

    if (!metodeTransaksi) {
      throw new NotFoundException('Metode transaksi tidak ditemukan');
    }

    // Temukan user jika diperlukan
    let user: User | undefined;
    if (pesananData.userId) {
      user = await this.userRepository.findOne({
        where: { id_user: pesananData.userId },
      })
      if (!user) {
        throw new NotFoundException('User tidak ditemukan');
      }
    }

    // Buat entitas pesanan baru
    const pesanan = this.pesananRepository.create({
      // Misalnya user yang melakukan pesanan
      user,
      total_harga_pesanan: 0, // Akan diupdate setelah detail produk disimpan
    });

    // Simpan pesanan sementara untuk mendapatkan id
    const savedPesanan = await this.pesananRepository.save(pesanan);

    // Simpan detail produk pesanan
    const detilProdukPesanan: DetilProdukPesanan[] = [];
    let totalHargaPesanan = 0;

    for (const detil of pesananData.detil_produk_pesanan) {
      const produk = await this.produkRepository.findOne({
        where: { id_produk: detil.id_produk },
      });

      if (!produk) {
        throw new NotFoundException(`Produk dengan ID ${detil.id_produk} tidak ditemukan`);
      }

      const totalHargaProduk = produk.harga_produk * detil.jumlah_produk;

      // Tambahkan detail produk pesanan
      const detail = this.detilProdukPesananRepository.create({
        produk: produk,
        jumlah_produk: detil.jumlah_produk,
        total_harga_produk: totalHargaProduk,
        pesanan: savedPesanan, // Hubungkan dengan pesanan yang disimpan
      });

      detilProdukPesanan.push(detail);
      totalHargaPesanan += totalHargaProduk;
    }

    // Simpan detail produk pesanan
    await this.detilProdukPesananRepository.save(detilProdukPesanan);

    // Update total harga pesanan
    savedPesanan.total_harga_pesanan = totalHargaPesanan;

    // Simpan pesanan dengan detail produk
    return this.pesananRepository.save(savedPesanan);
  }
}