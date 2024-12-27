import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pesanan } from './entities/pesanan.entity';
import { Transaksi } from 'src/transaksi/entities/transaksi.entity';
import { DetilProdukPesanan } from 'src/detil_produk_pesanan/entities/detil_produk_pesanan.entity';
import { MetodeTransaksi } from 'src/metode_transaksi/entities/metode_transaksi.entity';
import { User } from '../users/entities/user.entity';
import { Produk } from '../produk/entities/produk.entity';
import * as jwt from 'jsonwebtoken';
import { AuthService } from 'src/auth/auth.service';
import { Toko } from 'src/toko/entities/toko.entity';

@Injectable()
export class PesananService {
  constructor(
    @InjectRepository(Pesanan)
    private readonly pesananRepository: Repository<Pesanan>,
    @InjectRepository(DetilProdukPesanan)
    private readonly detilProdukPesananRepository: Repository<DetilProdukPesanan>,
    @InjectRepository(Produk)
    private readonly produkRepository: Repository<Produk>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(MetodeTransaksi)
    private readonly metodeTransaksiRepository: Repository<MetodeTransaksi>,
    @InjectRepository(Transaksi)
    private readonly transaksiRepository: Repository<Transaksi>,
    @InjectRepository (Toko)
    private readonly tokoRepository: Repository<Toko>,
  ) {}

  private readonly jwtSecret = 'your-secret-key'; // Ganti dengan kunci rahasia yang digunakan untuk membuat token JWT

  async savePesananAndTransaction(pesananData: {
    detil_produk_pesanan: { id_produk: string; jumlah_produk: number }[];
    metode_transaksi_id: string;
    id_user: string; // ID user yang diambil dari cookies
    id_toko: string; // ID toko yang diambil dari local storage
  }): Promise<Transaksi> {
    // Temukan metode transaksi
    const metodeTransaksi = await this.metodeTransaksiRepository.findOne({
      where: { id_metode_transaksi: pesananData.metode_transaksi_id },
    });
  
    if (!metodeTransaksi) {
      throw new NotFoundException('Metode transaksi tidak ditemukan');
    }
  
    // Temukan user berdasarkan id_user
    const user = await this.userRepository.findOne({
      where: { id_user: pesananData.id_user },
    });
  
    if (!user) {
      throw new NotFoundException('User  tidak ditemukan');
    }
  
    // Temukan toko berdasarkan id_toko
    const toko = await this.tokoRepository.findOne({
      where: { id_toko: pesananData.id_toko },
    });
  
    if (!toko) {
      throw new NotFoundException('Toko tidak ditemukan');
    }
  
    // Buat entitas pesanan baru
    const pesanan = this.pesananRepository.create({
      user,
      total_harga_pesanan: 0, // Akan diupdate setelah detail produk disimpan
    });
  
    // Simpan pesanan sementara untuk mendapatkan id
    const savedPesanan = await this.pesananRepository.save(pesanan);
  
    // Simpan detail produk pesanan
    const detilProdukPesanan: DetilProdukPesanan[] = [];
    let totalHargaPesanan = 0;
    let jumlahProdukTotal = 0;
  
    for (const detil of pesananData.detil_produk_pesanan) {
      const produk = await this.produkRepository.findOne({
        where: { id_produk: detil.id_produk },
      });
  
      if (!produk) {
        throw new NotFoundException(`Produk dengan ID ${detil.id_produk} tidak ditemukan`);
      }
  
      // Periksa apakah stok mencukupi
      if (produk.stok < detil.jumlah_produk) {
        throw new Error(`Stok produk ${produk.nama_produk} tidak mencukupi.`);
      }
  
      // Kurangi stok produk sesuai jumlah yang dipesan
      produk.stok -= detil.jumlah_produk;

      // Simpan perubahan stok ke database
      await this.produkRepository.save(produk);
  
      const totalHargaProduk = produk.harga_produk * detil.jumlah_produk;
      jumlahProdukTotal += detil.jumlah_produk;
  
      // Tambahkan detail produk pesanan
      const detail = this.detilProdukPesananRepository.create({
        produk,
        jumlah_produk: detil.jumlah_produk,
        total_harga_produk: totalHargaProduk,
        pesanan: savedPesanan,
      });
  
      detilProdukPesanan.push(detail);
      totalHargaPesanan += totalHargaProduk;
    }
  
    // Simpan detail produk pesanan
    await this.detilProdukPesananRepository.save(detilProdukPesanan);
  
    // Update total harga pesanan
    savedPesanan.total_harga_pesanan = totalHargaPesanan;
  
    // Simpan pesanan dengan detail produk
    await this.pesananRepository.save(savedPesanan);
  
    // Setelah pesanan disimpan, buat transaksi
    const transaksi = this.transaksiRepository.create({
      metodeTransaksi: [metodeTransaksi],
      totalHarga: totalHargaPesanan,
      pesanan: savedPesanan,
      user,
      toko, // Menyimpan relasi toko
    });
  
    // Simpan transaksi ke database
    const savedTransaksi = await this.transaksiRepository.save(transaksi);
  
    // Menambahkan informasi jumlah produk
    savedTransaksi['jumlahProdukTotal'] = jumlahProdukTotal;
  
    return savedTransaksi;
  }
}