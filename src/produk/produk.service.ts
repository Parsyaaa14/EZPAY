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

  async createProduk(createProdukDto: CreateProdukDto): Promise<Produk> {
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
    kategori?: string,
  ): Promise<Produk[]> {
    const queryBuilder = this.produkRepository
      .createQueryBuilder('produk')
      .leftJoinAndSelect('produk.kategori', 'kategori') // Menggabungkan entitas kategori
      .orderBy('produk.harga_produk', sort);

    if (kategori) {
      queryBuilder.andWhere('kategori.nama = :kategori', { kategori }); // Gunakan nama kolom yang benar dari entitas Kategori
    }

    return await queryBuilder.getMany();
  }

  async getProdukByStok(
    sort: 'ASC' | 'DESC',
    kategori?: string,
  ): Promise<Produk[]> {
    const queryBuilder = this.produkRepository
      .createQueryBuilder('produk')
      .leftJoinAndSelect('produk.kategori', 'kategori') // Menggabungkan entitas kategori
      .orderBy('produk.stok', sort);

    if (kategori) {
      queryBuilder.andWhere('kategori.nama = :kategori', { kategori }); // Gunakan nama kolom yang benar dari entitas Kategori
    }

    return await queryBuilder.getMany();
  }

  async findAll() {
    return this.produkRepository.findAndCount({
      relations: ['kategori'], // tambahkan relasi kategori di sini
    });
  }

  async findAllAktif(status?: StatusProduk): Promise<Produk[]> {
    if (status) {
      return this.produkRepository.find({
        where: { status_produk: status },
      });
    }
    return this.produkRepository.find();
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
      .where('toko.id_toko = :id_toko', { id_toko })
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
