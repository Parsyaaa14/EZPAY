import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaksi } from './entities/transaksi.entity';
import { Pesanan } from 'src/pesanan/entities/pesanan.entity';
import { MetodeTransaksi } from 'src/metode_transaksi/entities/metode_transaksi.entity';
import { BayarDto } from 'src/transaksi/dto/bayar-dto';

@Injectable()
export class TransaksiService {
  constructor(
    @InjectRepository(Transaksi)
    private readonly transaksiRepository: Repository<Transaksi>,
    @InjectRepository(Pesanan)
    private readonly pesananRepository: Repository<Pesanan>,
    @InjectRepository(MetodeTransaksi)
    private readonly metodeTransaksiRepository: Repository<MetodeTransaksi>,
  ) {}

  async bayar(bayarDto: BayarDto): Promise<Transaksi> {
    const { id_pesanan, totalBayar, metodeTransaksiId } = bayarDto;

    // Cari pesanan berdasarkan ID
    const pesanan = await this.pesananRepository.findOne({
      where: { id_pesanan },
      relations: ['detilProdukPesanan'], // Mengambil detail produk dalam pesanan
    });

    if (!pesanan) {
      throw new NotFoundException('Pesanan tidak ditemukan');
    }

    // Hitung total harga dari detail produk
    const totalHarga = pesanan.detilProdukPesanan.reduce(
      (sum, detail) => sum + detail.total_harga_produk,
      0,
    );
    if (totalHarga !== totalBayar) {
      throw new BadRequestException(
        'Total bayar tidak sesuai dengan total harga',
      );
    }

    // Cari metode transaksi berdasarkan ID
    const metodeTransaksi = await this.metodeTransaksiRepository.findOne({
      where: { id_metode_transaksi: metodeTransaksiId },
    });

    if (!metodeTransaksi) {
      throw new NotFoundException('Metode transaksi tidak ditemukan');
    }

    // Buat transaksi baru
    const transaksi = this.transaksiRepository.create({
      pesanan,
      metodeTransaksi: [metodeTransaksi],
      totalHarga: totalBayar,
    });

    // Simpan transaksi ke database
    return this.transaksiRepository.save(transaksi);
  }
}

// import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Transaksi } from './entities/transaksi.entity';
// import { Pesanan } from 'src/pesanan/entities/pesanan.entity';
// import { MetodeTransaksi } from 'src/metode_transaksi/entities/metode_transaksi.entity';
// import { CreateTransaksiDto } from './dto/create-transaksi.dto';

// @Injectable()
// export class TransaksiService {
//   constructor(
//     @InjectRepository(Transaksi)
//     private transaksiRepository: Repository<Transaksi>,
//     @InjectRepository(Pesanan)
//     private pesananRepository: Repository<Pesanan>,
//     @InjectRepository(MetodeTransaksi)
//     private metodeTransaksiRepository: Repository<MetodeTransaksi>,
//   ) {}

//   async bayar(createTransaksiDto: CreateTransaksiDto): Promise<Transaksi> {
//     const { id_pesanan, id_metodeTransaksi } = createTransaksiDto;

//     // Mencari pesanan berdasarkan ID
//     const pesanan = await this.pesananRepository.findOne({
//       where: { id_pesanan },
//       relations: ['detil_produk_pesanan'],
//     });

//     if (!pesanan) {
//       throw new NotFoundException('Pesanan tidak ditemukan');
//     }

//     // Mencari metode transaksi berdasarkan array ID
//     const metodeTransaksi = await this.metodeTransaksiRepository.findByIds(id_metodeTransaksi);

//     if (metodeTransaksi.length !== id_metodeTransaksi.length) {
//       throw new BadRequestException('Beberapa metode transaksi tidak ditemukan');
//     }

//     // Menghitung total harga berdasarkan detil produk pesanan
//     const totalHarga = pesanan.detilProdukPesanan.reduce(
//       (total, detil) => total + detil.total_harga_produk,
//       0,
//     );

//     // Membuat entitas Transaksi baru
//     const transaksi = this.transaksiRepository.create({
//       pesanan,
//       metodeTransaksi,
//       totalHarga,
//     });

//     // Menyimpan transaksi ke database
//     return this.transaksiRepository.save(transaksi);
//   }
//   async createTransaksi(createTransaksiDto: CreateTransaksiDto): Promise<Transaksi> {
//     const { id_pesanan, id_metodeTransaksi } = createTransaksiDto;

//     // Cari pesanan berdasarkan ID
//     const pesanan = await this.pesananRepository.findOne({
//       where: { id_pesanan },
//       relations: ['detil_produk_pesanan'],
//     });

//     if (!pesanan) {
//       throw new NotFoundException('Pesanan tidak ditemukan');
//     }

//     // Cari metode transaksi berdasarkan array ID
//     const metodeTransaksi = await this.metodeTransaksiRepository.findByIds(id_metodeTransaksi);

//     if (metodeTransaksi.length !== id_metodeTransaksi.length) {
//       throw new BadRequestException('Beberapa metode transaksi tidak ditemukan');
//     }

//     // Hitung total harga berdasarkan detail produk pesanan
//     const totalHarga = pesanan.detilProdukPesanan.reduce(
//       (total, detil) => total + detil.total_harga_produk,
//       0,
//     );

//     // Buat entitas Transaksi baru
//     const transaksi = this.transaksiRepository.create({
//       pesanan,
//       metodeTransaksi,
//       totalHarga,
//     });

//     // Simpan transaksi ke database
//     return this.transaksiRepository.save(transaksi);
//   }
// }
