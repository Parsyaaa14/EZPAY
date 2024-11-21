import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaksi } from './entities/transaksi.entity';
import { GetTransaksiFilterDto } from './dto/omset.dto';
import { User } from 'src/users/entities/user.entity';
import { startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class TransaksiService {
  constructor(
    @InjectRepository(Transaksi)
    private readonly transaksiRepository: Repository<Transaksi>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

  async getAllTransaksi(
    id_toko: string, // Menambahkan id_toko sebagai parameter
    startDate?: string,
    endDate?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    const query = this.transaksiRepository
      .createQueryBuilder('transaksi')
      .leftJoinAndSelect('transaksi.pesanan', 'pesanan')
      .leftJoinAndSelect('pesanan.detilProdukPesanan', 'detilProdukPesanan')
      .leftJoinAndSelect('transaksi.metodeTransaksi', 'metodeTransaksi')
      .leftJoinAndSelect('transaksi.user', 'user')
      .leftJoinAndSelect('detilProdukPesanan.produk', 'produk')
      .where('transaksi.id_toko = :id_toko', { id_toko }) // Filter berdasarkan id_toko
      .orderBy('transaksi.createdAt', 'DESC');
  
    // Menambahkan filter berdasarkan tanggal
    if (startDate && endDate) {
      if (this.isValidDate(startDate) && this.isValidDate(endDate)) {
        // Mengubah startDate dan endDate untuk mencakup seluruh hari
        const start = startOfDay(new Date(startDate));
        const end = endOfDay(new Date(endDate));
        query.andWhere('transaksi.createdAt BETWEEN :startDate AND :endDate', { startDate: start, endDate: end });
      }
    } else if (startDate) {
      if (this.isValidDate(startDate)) {
        const start = startOfDay(new Date(startDate));
        query.andWhere('transaksi.createdAt >= :startDate', { startDate: start });
      }
    } else if (endDate) {
      if (this.isValidDate(endDate)) {
        const end = endOfDay(new Date(endDate));
        query.andWhere('transaksi.createdAt <= :endDate', { endDate: end });
      }
    }
  
    // Pagination
    const [transaksiList, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
  
    return {
      data: transaksiList.map((transaksi) => {
        const produkDetail = transaksi.pesanan?.detilProdukPesanan?.map((detil) => ({
          kode_produk: detil.produk?.kode_produk ?? 'N/A',
          nama_produk: detil.produk?.nama_produk ?? 'N/A',
          jumlah: detil.jumlah_produk,
          harga: detil.produk?.harga_produk ?? 0,
          total: detil.total_harga_produk,
        })) ?? [];
  
        const metodeTransaksi = transaksi.metodeTransaksi?.map((metode) => metode.nama) ?? [];
  
        return {
          id_transaksi: transaksi.id_transaksi,
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
      }),
      total, // Total jumlah transaksi
      page, // Halaman saat ini
      limit, // Jumlah item per halaman
    };
  }  

  private isValidDate(dateString: string): boolean {
    // Format YYYY-MM-DD
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString) && !isNaN(new Date(dateString).getTime());
  }

  async countTransaksiByToko(id_toko: string): Promise<number> {
    // Menghitung jumlah transaksi berdasarkan id_toko
    return this.transaksiRepository.count({
      where: {
        toko: {
          id_toko: id_toko, // Filter transaksi berdasarkan id_toko
        },
      },
    });
  }
  

  async getMonthlySales(idToko: string): Promise<{ month: string; total: number }[]> {
    const query = this.transaksiRepository.createQueryBuilder('transaksi')
      .select(`TO_CHAR(transaksi.createdAt, 'YYYY-MM')`, 'month') // Perhatikan penggunaan `createdAt` sesuai dengan nama kolom Anda
      .addSelect('SUM(transaksi.totalHarga)', 'total')
      .where('transaksi.id_toko = :idToko', { idToko })
      .groupBy('month')
      .orderBy('month', 'ASC');

    return await query.getRawMany();
  }
  

  async getTotalHarga(filterDto: GetTransaksiFilterDto): Promise<number> {
    const { period, id_toko } = filterDto; // Ambil id_toko dari filterDto

    const query = this.transaksiRepository.createQueryBuilder('transaksi');

    // Filter berdasarkan id_toko
    if (id_toko) {
      query.andWhere('transaksi.toko.id_toko = :id_toko', { id_toko });
    } else {
      throw new Error('id_toko is required');
    }

    // Menentukan rentang waktu berdasarkan period
    const now = new Date();
    switch (period) {
      case 'today':
        query.andWhere('transaksi.createdAt >= :startDate AND transaksi.createdAt <= :endDate', {
          startDate: new Date(now.setHours(0, 0, 0, 0)),
          endDate: new Date(now.setHours(23, 59, 59, 999)),
        });
        break;
      case 'yesterday':
        now.setDate(now.getDate() - 1);
        query.andWhere('transaksi.createdAt >= :startDate AND transaksi.createdAt <= :endDate', {
          startDate: new Date(now.setHours(0, 0, 0, 0)),
          endDate: new Date(now.setHours(23, 59, 59, 999)),
        });
        break;
      case 'this_week':
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1)); // Senin
        const endOfWeek = new Date(now.setDate(startOfWeek.getDate() + 6)); // Minggu
        query.andWhere('transaksi.createdAt >= :startDate AND transaksi.createdAt <= :endDate', {
          startDate: new Date(startOfWeek.setHours(0, 0, 0, 0)),
          endDate: new Date(endOfWeek.setHours(23, 59, 59, 999)),
        });
        break;
      case 'last_week':
        now.setDate(now.getDate() - 7);
        const lastWeekStart = new Date(now.setDate(now.getDate() - now.getDay() + 1)); // Senin minggu lalu
        const lastWeekEnd = new Date(now.setDate(lastWeekStart.getDate() + 6)); // Minggu lalu
        query.andWhere('transaksi.createdAt >= :startDate AND transaksi.createdAt <= :endDate', {
          startDate: new Date(lastWeekStart.setHours(0, 0, 0, 0)),
          endDate: new Date(lastWeekEnd.setHours(23, 59, 59, 999)),
        });
        break;
      case 'this_month':
        query.andWhere('transaksi.createdAt >= :startDate AND transaksi.createdAt <= :endDate', {
          startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999),
        });
        break;
      case 'last_month':
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        query.andWhere('transaksi.createdAt >= :startDate AND transaksi.createdAt <= :endDate', {
          startDate: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
          endDate: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0, 23, 59, 59, 999),
        });
        break;
      case 'last_30_days':
        query.andWhere('transaksi.createdAt >= :startDate AND transaksi.createdAt <= :endDate', {
          startDate: new Date(now.setDate(now.getDate() - 30)),
          endDate: new Date(),
        });
        break;
      case 'this_quarter':
        const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        const quarterEnd = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 + 3, 0, 23, 59, 59, 999);
        query.andWhere('transaksi.createdAt >= :startDate AND transaksi.createdAt <= :endDate', {
          startDate: quarterStart,
          endDate: quarterEnd,
        });
        break;
      case 'last_quarter':
        const lastQuarterStart = new Date(now.getFullYear(), Math.floor((now.getMonth() - 3) / 3) * 3, 1);
        const lastQuarterEnd = new Date(now.getFullYear(), Math.floor((now.getMonth() - 3) / 3) * 3 + 3, 0, 23, 59, 59, 999);
        query.andWhere('transaksi.createdAt >= :startDate AND transaksi.createdAt <= :endDate', {
          startDate: lastQuarterStart,
          endDate: lastQuarterEnd,
        });
        break;
      case 'this_year':
        query.andWhere('transaksi.createdAt >= :startDate AND transaksi.createdAt <= :endDate', {
          startDate: new Date(now.getFullYear(), 0, 1),
          endDate: new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999),
        });
        break;
      case 'last_year':
        query.andWhere('transaksi.createdAt >= :startDate AND transaksi.createdAt <= :endDate', {
          startDate: new Date(now.getFullYear() - 1, 0, 1),
          endDate: new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999),
        });
        break;
      default:
        throw new Error('Invalid period specified');
    }

    const totalHarga = await query
      .select('SUM(transaksi.totalHarga)', 'total')
      .getRawOne();

    return totalHarga.total || 0;
  }

  async getTransaksiByUser(id_user: string) {
    // Cari user berdasarkan id_user untuk mendapatkan id_toko
    const user = await this.userRepository.findOne({
      where: { id_user },
      relations: ['toko'], // Mengambil relasi toko dari user
    });

    if (!user || !user.toko) {
      throw new Error('Toko tidak ditemukan untuk user ini');
    }

    const id_toko = user.toko.id_toko;

    // Filter transaksi berdasarkan id_toko
    return this.transaksiRepository.find({
      where: { toko: { id_toko } },
      relations: ['pesanan', 'metodeTransaksi'], // Jika perlu relasi tambahan
    });
  }

  async getAllTransaksiKasirOnly(
    id_user: string,
    startDate?: string,
    endDate?: string,
    page: number = 1,
    limit: number = 10, // Pastikan limit bisa diubah
  ): Promise<any> {
    const query = this.transaksiRepository
      .createQueryBuilder('transaksi')
      .leftJoinAndSelect('transaksi.pesanan', 'pesanan')
      .leftJoinAndSelect('pesanan.detilProdukPesanan', 'detilProdukPesanan')
      .leftJoinAndSelect('transaksi.metodeTransaksi', 'metodeTransaksi')
      .leftJoinAndSelect('transaksi.user', 'user')
      .leftJoinAndSelect('detilProdukPesanan.produk', 'produk')
      .where('transaksi.user.id_user = :id_user', { id_user })
      .orderBy('transaksi.createdAt', 'DESC');
  
    // Filter tanggal (jika ada)
    if (startDate || endDate) {
      const start = startDate ? startOfDay(new Date(startDate)) : undefined;
      const end = endDate ? endOfDay(new Date(endDate)) : undefined;
  
      if (start && end) {
        query.andWhere('transaksi.createdAt BETWEEN :startDate AND :endDate', {
          startDate: start,
          endDate: end,
        });
      } else if (start) {
        query.andWhere('transaksi.createdAt >= :startDate', { startDate: start });
      } else if (end) {
        query.andWhere('transaksi.createdAt <= :endDate', { endDate: end });
      }
    }
  
    // Pagination
    const [transaksiList, total] = await query
      .skip((page - 1) * limit) // Halaman dimulai dari offset yang benar
      .take(limit) // Ambil sesuai jumlah item per halaman
      .getManyAndCount();
  
    // Transform data
    const data = transaksiList.map((transaksi) => {
      const produkDetail =
        transaksi.pesanan?.detilProdukPesanan?.map((detil) => ({
          kode_produk: detil.produk?.kode_produk ?? 'N/A',
          nama_produk: detil.produk?.nama_produk ?? 'N/A',
          jumlah: detil.jumlah_produk,
          harga: detil.produk?.harga_produk ?? 0,
          total: detil.total_harga_produk,
        })) ?? [];
  
      const metodeTransaksi =
        transaksi.metodeTransaksi?.map((metode) => metode.nama) ?? [];
  
      return {
        id_transaksi: transaksi.id_transaksi,
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
  
    return {
      data,
      total, // Total jumlah transaksi
      page, // Halaman saat ini
      limit, // Jumlah item per halaman
    };
  }
   
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