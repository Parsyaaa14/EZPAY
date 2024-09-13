import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pesanan } from './entities/pesanan.entity';
import { Transaksi } from 'src/transaksi/entities/transaksi.entity';
import { DetilProdukPesanan } from 'src/detil_produk_pesanan/entities/detil_produk_pesanan.entity';
import { MetodeTransaksi } from 'src/metode_transaksi/entities/metode_transaksi.entity';
import { User } from '../users/entities/user.entity';
import { Produk } from '../produk/entities/produk.entity';

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
  ) {}

  // async saveOrderAndTransaction(pesananData: {
  //   detil_produk_pesanan: { id_produk: string; jumlah_produk: number }[];
  //   metode_transaksi_id: string;
  //   userId?: string; // Optional jika ingin menyimpan user yang melakukan pesanan
  // }): Promise<Transaksi> {
  //   // Temukan metode transaksi
  //   const metodeTransaksi = await this.metodeTransaksiRepository.findOne({
  //     where: { id_metode_transaksi: pesananData.metode_transaksi_id },
  //   });

  //   if (!metodeTransaksi) {
  //     throw new NotFoundException('Metode transaksi tidak ditemukan');
  //   }

  //   // Temukan user jika diperlukan, jika tidak ada userId, gunakan user yang terautentikasi
  //   let user: User | undefined;
  //   if (pesananData.userId) {
  //     user = await this.userRepository.findOne({
  //       where: { id_user: pesananData.userId },
  //     });
  //     if (!user) {
  //       throw new NotFoundException('User tidak ditemukan');
  //     }
  //   } else {
  //     // Logika untuk mendapatkan user dari sesi atau token
  //     // Contoh: user = await this.authService.getCurrentUser(); // Sesuaikan dengan metode autentikasi Anda
  //     throw new UnauthorizedException('User tidak terautentikasi');
  //   }

  //   // Buat entitas pesanan baru
  //   const pesanan = this.pesananRepository.create({
  //     user,
  //     total_harga_pesanan: 0, // Akan diupdate setelah detail produk disimpan
  //   });

  //   // Simpan pesanan sementara untuk mendapatkan id
  //   const savedPesanan = await this.pesananRepository.save(pesanan);

  //   // Simpan detail produk pesanan
  //   const detilProdukPesanan: DetilProdukPesanan[] = [];
  //   let totalHargaPesanan = 0;
  //   let jumlahProdukTotal = 0;

  //   for (const detil of pesananData.detil_produk_pesanan) {
  //     const produk = await this.produkRepository.findOne({
  //       where: { id_produk: detil.id_produk },
  //     });

  //     if (!produk) {
  //       throw new NotFoundException(`Produk dengan ID ${detil.id_produk} tidak ditemukan`);
  //     }

  //     const totalHargaProduk = produk.harga_produk * detil.jumlah_produk;
  //     jumlahProdukTotal += detil.jumlah_produk;

  //     // Tambahkan detail produk pesanan
  //     const detail = this.detilProdukPesananRepository.create({
  //       produk,
  //       jumlah_produk: detil.jumlah_produk,
  //       total_harga_produk: totalHargaProduk,
  //       pesanan: savedPesanan,
  //     });

  //     detilProdukPesanan.push(detail);
  //     totalHargaPesanan += totalHargaProduk;
  //   }

  //   // Simpan detail produk pesanan
  //   await this.detilProdukPesananRepository.save(detilProdukPesanan);

  //   // Update total harga pesanan
  //   savedPesanan.total_harga_pesanan = totalHargaPesanan;

  //   // Simpan pesanan dengan detail produk
  //   await this.pesananRepository.save(savedPesanan);

  //   // Setelah pesanan disimpan, buat transaksi
  //   const transaksi = await this.transaksiRepository.save({
  //     metodeTransaksi: [metodeTransaksi],
  //     totalHarga: totalHargaPesanan,
  //     pesanan: savedPesanan,
  //     user,
  //   });

  //   // Menambahkan informasi jumlah produk
  //   transaksi['jumlahProdukTotal'] = jumlahProdukTotal;

  //   return transaksi;
  // }


  async saveOrderAndTransaction(pesananData: {
    detil_produk_pesanan: { id_produk: string; jumlah_produk: number }[];
    metode_transaksi_id: string;
    userId?: string; // Optional jika ingin menyimpan user yang melakukan pesanan
  }): Promise<Transaksi> {
    // Temukan metode transaksi
    const metodeTransaksi = await this.metodeTransaksiRepository.findOne({
      where: { id_metode_transaksi: pesananData.metode_transaksi_id },
    });
  
    if (!metodeTransaksi) {
      throw new NotFoundException('Metode transaksi tidak ditemukan');
    }
  
    // Temukan user jika diperlukan
    let user: User | undefined;
    if (pesananData.userId) {
      user = await this.userRepository.findOne({
        where: { id_user: pesananData.userId },
      });
      if (!user) {
        throw new NotFoundException('User tidak ditemukan');
      }
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
    const transaksi = await this.transaksiRepository.save({
      metodeTransaksi: [metodeTransaksi],
      totalHarga: totalHargaPesanan,
      pesanan: savedPesanan,
      user,
    });
  
    // Menambahkan informasi jumlah produk
    transaksi['jumlahProdukTotal'] = jumlahProdukTotal;
  
    return transaksi;
  }
}

// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Pesanan } from './entities/pesanan.entity';
// import { DetilProdukPesanan } from 'src/detil_produk_pesanan/entities/detil_produk_pesanan.entity';
// import { Produk } from 'src/produk/entities/produk.entity';
// import { MetodeTransaksi } from 'src/metode_transaksi/entities/metode_transaksi.entity';
// import { User } from 'src/users/entities/user.entity'; // Tambahkan import untuk User
// import { Transaksi } from 'src/transaksi/entities/transaksi.entity';

// @Injectable()
// export class PesananService {
//   constructor(
//     @InjectRepository(Pesanan)
//     private readonly pesananRepository: Repository<Pesanan>,
//     @InjectRepository(DetilProdukPesanan)
//     private readonly detilProdukPesananRepository: Repository<DetilProdukPesanan>,
//     @InjectRepository(Produk)
//     private readonly produkRepository: Repository<Produk>,
//     @InjectRepository(MetodeTransaksi)
//     private readonly metodeTransaksiRepository: Repository<MetodeTransaksi>,
//     @InjectRepository(User) // Tambahkan inject repository untuk User jika diperlukan
//     private readonly userRepository: Repository<User>,
//     @InjectRepository(Transaksi)
//     private readonly transaksiRepository: Repository<Transaksi>,
//   ) {}

//   async save(pesananData: {
//     detil_produk_pesanan: { id_produk: string; jumlah_produk: number }[];
//     metode_transaksi_id: string;
//     userId?: string; // Optional jika ingin menyimpan user yang melakukan pesanan
//   }): Promise<Pesanan> {
//     // Temukan metode transaksi
//     const metodeTransaksi = await this.metodeTransaksiRepository.findOne({
//       where: { id_metode_transaksi: pesananData.metode_transaksi_id },
//     });

//     if (!metodeTransaksi) {
//       throw new NotFoundException('Metode transaksi tidak ditemukan');
//     }

//     // Temukan user jika diperlukan
//     let user: User | undefined;
//     if (pesananData.userId) {
//       user = await this.userRepository.findOne({
//         where: { id_user: pesananData.userId },
//       });
//       if (!user) {
//         throw new NotFoundException('User tidak ditemukan');
//       }
//     }

//     // Buat entitas pesanan baru
//     const pesanan = this.pesananRepository.create({
//       user,
//       total_harga_pesanan: 0, // Akan diupdate setelah detail produk disimpan
//     });

//     // Simpan pesanan sementara untuk mendapatkan id
//     const savedPesanan = await this.pesananRepository.save(pesanan);

//     // Simpan detail produk pesanan
//     const detilProdukPesanan: DetilProdukPesanan[] = [];
//     let totalHargaPesanan = 0;

//     for (const detil of pesananData.detil_produk_pesanan) {
//       const produk = await this.produkRepository.findOne({
//         where: { id_produk: detil.id_produk },
//       });

//       if (!produk) {
//         throw new NotFoundException(
//           `Produk dengan ID ${detil.id_produk} tidak ditemukan`,
//         );
//       }

//       const totalHargaProduk = produk.harga_produk * detil.jumlah_produk;

//       // Tambahkan detail produk pesanan
//       const detail = this.detilProdukPesananRepository.create({
//         produk,
//         jumlah_produk: detil.jumlah_produk,
//         total_harga_produk: totalHargaProduk,
//         pesanan: savedPesanan,
//       });

//       detilProdukPesanan.push(detail);
//       totalHargaPesanan += totalHargaProduk;
//     }

//     // Simpan detail produk pesanan
//     await this.detilProdukPesananRepository.save(detilProdukPesanan);

//     // Update total harga pesanan
//     savedPesanan.total_harga_pesanan = totalHargaPesanan;

//     // Simpan pesanan dengan detail produk
//     await this.pesananRepository.save(savedPesanan);

//     // Setelah pesanan disimpan, buat transaksi
//     await this.transaksiRepository.save({
//       metode_transaksi: metodeTransaksi,
//       total_harga_pesanan: totalHargaPesanan,
//       pesanan: savedPesanan,
//     })
//     // await this.transaksiRepository.bayar(savedPesanan.id_pesanan, pesananData.metode_transaksi_id);

//     return savedPesanan;
//   }
// }
