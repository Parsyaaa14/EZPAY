import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProdukDto } from './dto/create-produk.dto';
import { UpdateProdukDto } from './dto/update-produk.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Produk, StatusProduk } from './entities/produk.entity';
import { Repository, MoreThan } from 'typeorm';
import { EntityNotFoundError } from 'typeorm';
import { Kategori } from 'src/kategori/entities/kategori.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ProdukService {
  constructor(
    @InjectRepository(Produk)
    private produkRepository: Repository<Produk>,
    @InjectRepository(Kategori)
    private readonly kategoriRepository: Repository<Kategori>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createProduk(createProdukDto: CreateProdukDto, idToko: string): Promise<Produk> {
    let kategori: Kategori;

    // Cari kategori berdasarkan id_kategori
    kategori = await this.kategoriRepository.findOne({
      where: {
        id_kategori: createProdukDto.id_kategori,
      },
    });

    if (!kategori) {
      throw new NotFoundException(
        `Kategori dengan id ${createProdukDto.id_kategori} tidak ditemukan`,
      );
    }

    // Buat produk baru dengan kategori yang sesuai
    const newProduk = this.produkRepository.create({
      ...createProdukDto,
      kategori,
      toko: { id_toko: idToko }, // Menambahkan id_toko di sini
    });

    // Simpan produk dan tangani error jika ada
    try {
      return await this.produkRepository.save(newProduk);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error saving product: ${error.message}`,
      );
    }
  }

  // async getProdukByStatus(status: string, idToko: string): Promise<Produk[]> {
  //   try {
  //     const queryBuilder = this.produkRepository.createQueryBuilder('produk');

  //     // Filter berdasarkan id_toko
  //     queryBuilder.where('produk.toko_id_toko = :idToko', { idToko });

  //     // Jika status bukan 'all', tambahkan filter untuk status
  //     if (status && status !== 'all') {
  //       queryBuilder.andWhere('produk.status_produk = :status', { status });
  //     }

  //     const produk = await queryBuilder.getMany();

  //     return produk.length ? produk : []; // Mengembalikan array kosong jika tidak ada produk
  //   } catch (error) {
  //     throw new Error(`Gagal mengambil produk: ${error.message}`);
  //   }
  // }


  async filterProdukByKategori(
    id_toko: string, // Pastikan id_toko adalah parameter wajib
    id_kategori: string, // id_kategori tetap opsional jika diinginkan
  ): Promise<Produk[]> {
    try {
      const produk = await this.produkRepository.find({
        where: {
          kategori: { id_kategori }, // Filter berdasarkan kategori
          toko: { id_toko }, // Tambahkan filter berdasarkan id_toko
        },
      });

      return produk.length ? produk : []; // Mengembalikan array kosong jika tidak ada produk
    } catch (error) {
      throw new Error(
        `Gagal memfilter produk berdasarkan kategori dan toko: ${error.message}`,
      );
    }
  }

  async filterProdukByUser(id_user: string, sort: 'ASC' | 'DESC'): Promise<Produk[]> {
    // Mendapatkan user
    const user = await this.usersRepository.findOne({ where: { id_user }, relations: ['toko'] });

    if (!user || !user.toko) {
      throw new NotFoundException('User atau Toko tidak ditemukan');
    }

    const id_toko = user.toko.id_toko; // Mengambil id_toko dari user

    // Query untuk mendapatkan produk berdasarkan id_toko, diurutkan sesuai sort
    const produk = await this.produkRepository
      .createQueryBuilder('produk')
      .where('produk.id_toko = :id_toko', { id_toko })
      .orderBy('produk.nama_produk', sort) // Mengatur pengurutan berdasarkan nama produk
      .getMany();

    return produk;
  }

  // async getProdukByHarga(sort: 'ASC' | 'DESC', kategori?: string): Promise<Produk[]> {
  //   const queryBuilder = this.produkRepository.createQueryBuilder('produk')
  //     .orderBy('produk.harga_produk', sort);

  //   if (kategori) {
  //     queryBuilder.andWhere('produk.id_kategori = :kategori', { kategori });
  //   }

  //   return await queryBuilder.getMany();
  // }

  async getProdukByHarga(
    sort: 'ASC' | 'DESC',
    id_toko: string, // Tambahkan parameter id_toko
    kategori?: string,
  ): Promise<Produk[]> {
    const queryBuilder = this.produkRepository
      .createQueryBuilder('produk')
      .leftJoinAndSelect('produk.kategori', 'kategori') // Menggabungkan entitas kategori
      .where('produk.toko_id_toko = :id_toko', { id_toko }) // Menambahkan filter berdasarkan id_toko
      .orderBy('produk.harga_produk', sort);
  
    if (kategori) {
      queryBuilder.andWhere('kategori.nama = :kategori', { kategori }); // Gunakan nama kolom yang benar dari entitas Kategori
    }
  
    return await queryBuilder.getMany();
  }

  async getProdukByStok(
    sort: 'ASC' | 'DESC',
    id_toko: string,
    id_kategori?: string,
  ): Promise<Produk[]> {
    const queryBuilder = this.produkRepository
      .createQueryBuilder('produk')
      .leftJoinAndSelect('produk.kategori', 'kategori') // Menggabungkan entitas kategori
      .where('produk.toko_id_toko = :id_toko', { id_toko }) // Menambahkan filter berdasarkan id_toko
      .orderBy('produk.stok', sort);
  
    if (id_kategori) {
      queryBuilder.andWhere('produk.id_kategori = :id_kategori', { id_kategori }); // Menggunakan ID kategori
    }
  
    return await queryBuilder.getMany();
  }
  

  async findAll() {
    return this.produkRepository.findAndCount({
      relations: ['kategori'], // tambahkan relasi kategori di sini
    });
  }

  async findAllAktif(status?: StatusProduk, id_toko?: string): Promise<Produk[]> {
    const queryBuilder = this.produkRepository.createQueryBuilder('produk');
  
    if (id_toko) {
      queryBuilder.andWhere('produk.toko.id_toko = :id_toko', { id_toko });
    }
  
    if (status) {
      queryBuilder.andWhere('produk.status_produk = :status', { status });
    }
  
    return await queryBuilder.getMany();
  }
  
  async searchProduk(nama_produk: string, id_toko: string): Promise<Produk[]> {
    return await this.produkRepository
      .createQueryBuilder('produk')
      .innerJoin('produk.toko', 'toko') // Menggunakan inner join untuk menghubungkan produk dengan toko
      .where('produk.nama_produk ILIKE :nama', { nama: `%${nama_produk}%` }) // ILIKE untuk pencarian case-insensitive
      .andWhere('toko.id_toko = :id_toko', { id_toko }) // Filter berdasarkan id_toko
      .getMany();
  }

  async findOne(id: string) {
    try {
      return await this.produkRepository.findOneOrFail({
        where: {
          id_produk: id,
        },
      });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw e;
      }
    }
  }

  async updateProduk(
    id_produk: string,
    updateProdukDto: UpdateProdukDto,
  ): Promise<Produk> {
    const { nama: namaKategori, ...updateData } = updateProdukDto;

    // Cari produk berdasarkan ID
    const produk = await this.produkRepository.findOne({
      where: { id_produk },
    });

    if (!produk) {
      throw new NotFoundException(
        `Produk dengan ID ${id_produk} tidak ditemukan`,
      );
    }

    // Jika nama kategori di-update, pastikan kategori tersebut ada
    if (namaKategori) {
      const kategori = await this.kategoriRepository.findOne({
        where: { nama: namaKategori },
      });

      if (!kategori) {
        throw new NotFoundException(
          `Kategori dengan nama ${namaKategori} tidak ditemukan`,
        );
      }

      produk.kategori = kategori;
    }

    // Update produk dengan data baru
    Object.assign(produk, updateData);

    return this.produkRepository.save(produk);
  }

  async getAllProduk(id_toko: string): Promise<number> {
    // Menghitung jumlah produk yang ada di database berdasarkan id_toko
    const count = await this.produkRepository
      .createQueryBuilder('produk')
      .leftJoin('produk.toko', 'toko')
      .where('toko.id_toko = :id_toko', { id_toko })
      .getCount();

    return count;
  }

  async findProductsByToko(id_toko: string): Promise<Produk[]> {
    return await this.produkRepository
      .createQueryBuilder('produk')
      .leftJoinAndSelect('produk.toko', 'toko')
      .leftJoinAndSelect('produk.kategori', 'kategori') // Menyertakan kategori sebagai objek
      .where('toko.id_toko = :id_toko', { id_toko }) // Hanya kondisi untuk toko
      .getMany();
  }
  
  

  async filterProdukMinStok(id_toko: string): Promise<Produk[]> {
    // Query untuk mendapatkan produk dengan stok lebih dari 0, diurutkan dari stok terkecil
    const produk = await this.produkRepository
      .createQueryBuilder('produk')
      .innerJoin('produk.toko', 'toko') // Menggunakan inner join untuk menghubungkan produk dengan toko
      .where('produk.stok > 0')
      .andWhere('toko.id_toko = :id_toko', { id_toko }) // Filter berdasarkan id_toko dari relasi
      .orderBy('produk.stok', 'ASC')
      .limit(2)
      .getMany();
  
    return produk;
  }
  

  async remove(id: string) {
    try {
      await this.produkRepository.findOneOrFail({
        where: {
          id_produk: id,
        },
      });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw e;
      }
    }

    await this.produkRepository.delete(id);
  }
}
