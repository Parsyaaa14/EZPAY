import { Injectable, HttpException,HttpStatus, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateProdukDto } from './dto/create-produk.dto';
import { UpdateProdukDto } from './dto/update-produk.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Produk } from './entities/produk.entity';
import { Repository } from 'typeorm';
import { EntityNotFoundError } from 'typeorm';
import { Kategori } from 'src/kategori/entities/kategori.entity';




@Injectable()
export class ProdukService {

  constructor(
    @InjectRepository(Produk)
    private produkRepository: Repository<Produk>,
    @InjectRepository(Kategori)
    private readonly kategoriRepository: Repository<Kategori>,
  ) {}

  async createProduk(createProdukDto: CreateProdukDto):Promise<Produk> {
    //periksa apakah id kategori ada
    const kategori = await this.kategoriRepository.findOne({
      where: {
        id_kategori: createProdukDto.id_kategori
      }
    })
    if (!kategori) {
      throw new NotFoundException(`Kategori dengan id ${createProdukDto.id_kategori} tidak ditemukan`);
    }
    const newProduk = this.produkRepository.create({
      ...createProdukDto,
      kategori
    });
    return this.produkRepository.save(newProduk);
  }

  async filterProdukMinStok(): Promise<Produk[]> {
    // Query untuk mendapatkan produk dengan stok lebih dari 0, diurutkan dari stok terkecil
    const produk = await this.produkRepository
      .createQueryBuilder('produk')
      .where('produk.stok > 0')
      .orderBy('produk.stok', 'ASC')
      .limit(2)
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
  
  async getProdukByHarga(sort: 'ASC' | 'DESC', kategori?: string): Promise<Produk[]> {
    const queryBuilder = this.produkRepository.createQueryBuilder('produk')
      .leftJoinAndSelect('produk.kategori', 'kategori') // Menggabungkan entitas kategori
      .orderBy('produk.harga_produk', sort);
    
    if (kategori) {
      queryBuilder.andWhere('kategori.nama = :kategori', { kategori }); // Gunakan nama kolom yang benar dari entitas Kategori
    }
  
    return await queryBuilder.getMany();
  }

  findAll() {
    return this.produkRepository.findAndCount();
  }

  async searchProduk(nama_produk: string): Promise<Produk[]> {
    return await this.produkRepository
      .createQueryBuilder('produk')
      .where('produk.nama_produk ILIKE :nama', { nama: `%${nama_produk}%` }) // ILIKE untuk pencarian case-insensitive
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

  async updateProduk(nama_produk: string, updateProdukDto: UpdateProdukDto): Promise<Produk> {
    const { nama, ...updateData } = updateProdukDto;

    // Cari produk berdasarkan nama produk
    const produk = await this.produkRepository.findOne({ where: { nama_produk } });

    if (!produk) {
      throw new NotFoundException(`Produk dengan nama ${nama_produk} tidak ditemukan`);
    }

    // Jika nama kategori di-update, pastikan kategori tersebut ada
    if (nama) {
      const kategori = await this.kategoriRepository.findOne({
        where: { nama: nama },
      });

      if (!kategori) {
        throw new NotFoundException(`Kategori dengan nama ${nama} tidak ditemukan`);
      }

      produk.kategori = kategori;
    }

    // Update produk dengan data baru
    Object.assign(produk, updateData);

    // Generate kode_produk secara otomatis
    produk.kode_produk = this.generateRandomCode();

    // produk.status_produk = !produk.status_produk;


    return this.produkRepository.save(produk);
  }

  private generateRandomCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Huruf dan angka
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  async getAllProduk(): Promise<number> {
    // Menghitung jumlah produk yang ada di database
    const count = await this.produkRepository.count();
    return count;
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
