import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaksi } from './entities/transaksi.entity';
import { GetTransaksiFilterDto } from './dto/omset.dto';

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

  async findByUserId(id_user: string): Promise<Transaksi[]> {
    return this.transaksiRepository.find({
      where: {
        user: {
          id_user,
          role: {
            nama: 'Kasir', // Check that the user has the role "Kasir"
          },
        },
      },
      relations: ['user', 'user.role', 'pesanan', 'metodeTransaksi'], // Ensure user role is loaded
    });
  }

  async getAllTransaksi(startDate?: string, endDate?: string): Promise<any[]> {
    const query = this.transaksiRepository
      .createQueryBuilder('transaksi')
      .leftJoinAndSelect('transaksi.pesanan', 'pesanan')
      .leftJoinAndSelect('pesanan.detilProdukPesanan', 'detilProdukPesanan')
      .leftJoinAndSelect('transaksi.metodeTransaksi', 'metodeTransaksi')
      .leftJoinAndSelect('transaksi.user', 'user')
      .leftJoinAndSelect('detilProdukPesanan.produk', 'produk')
      .orderBy('transaksi.createdAt', 'DESC');

    if (startDate && endDate) {
      if (this.isValidDate(startDate) && this.isValidDate(endDate)) {
        query.andWhere('transaksi.createdAt BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        });
      }
    } else if (startDate) {
      if (this.isValidDate(startDate)) {
        query.andWhere('transaksi.createdAt >= :startDate', { startDate });
      }
    } else if (endDate) {
      if (this.isValidDate(endDate)) {
        query.andWhere('transaksi.createdAt <= :endDate', { endDate });
      }
    }

    const transaksiList = await query.getMany();

    return transaksiList.map((transaksi) => {
      // Pastikan relasi tidak null sebelum mengakses propertinya
      const produkDetail =
        transaksi.pesanan?.detilProdukPesanan?.map((detil) => ({
          kode_produk: detil.produk?.kode_produk ?? 'N/A',
          nama_produk: detil.produk?.nama_produk ?? 'N/A', // Sesuaikan jika nama berbeda
          jumlah: detil.jumlah_produk,
          harga: detil.produk?.harga_produk ?? 0,
          total: detil.total_harga_produk,
        })) ?? [];

      const metodeTransaksi =
        transaksi.metodeTransaksi?.map((metode) => metode.nama) ?? [];

      return {
        id_transaksi: transaksi.id_transaksi, // Menyertakan id_transaksi
        jumlah_produk: produkDetail.reduce((acc, item) => acc + item.jumlah, 0),
        totalHarga: transaksi.totalHarga ?? 0,
        createdAt: transaksi.createdAt ?? new Date(),
        metodeTransaksi,
        user: {
          id_user: transaksi.user?.id_user ?? 'N/A',
          nama: transaksi.user?.nama ?? 'N/A',
        },
        produkDetail,
      };
    });
  }

  private isValidDate(dateString: string): boolean {
    // Format YYYY-MM-DD
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString) && !isNaN(new Date(dateString).getTime());
  }

  async getAllTransaksiCount(): Promise<number> {
    // Menghitung jumlah produk yang ada di database
    const count = await this.transaksiRepository.count();
    return count;
  }

  async getMonthlySales(): Promise<{ month: string; total: number }[]> {
    const query = this.transaksiRepository.createQueryBuilder('transaksi')
      .select(`TO_CHAR(transaksi.created_at, 'YYYY-MM')`, 'month')
      .addSelect('SUM(transaksi.total_harga)', 'total')
      .groupBy('month')
      .orderBy('month', 'ASC');
  
    return await query.getRawMany();
  }
  

  async getTotalHarga(filterDto: GetTransaksiFilterDto): Promise<number> {
    const { period } = filterDto;

    const query = this.transaksiRepository.createQueryBuilder('transaksi');

    if (period) {
      const startDate = this.getStartDate(period);
      query.where('transaksi.created_at >= :startDate', { startDate });
    }

    const totalHarga = await query
      .select('SUM(transaksi.total_harga)', 'total')
      .getRawOne();

    return totalHarga.total || 0;
  }

  private getStartDate(period: string): Date {
    const date = new Date();
    switch (period) {
      case 'day':
        date.setDate(date.getDate() - 1);
        break;
      case 'week':
        date.setDate(date.getDate() - 7);
        break;
      case 'month':
        date.setMonth(date.getMonth() - 1);
        break;
      case 'year':
        date.setFullYear(date.getFullYear() - 1);
        break;
    }
    return date;
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
