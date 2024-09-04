import { Injectable, HttpException,HttpStatus, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateProdukDto } from './dto/create-produk.dto';
import { UpdateProdukDto } from './dto/update-produk.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Produk } from './entities/produk.entity';
import { Repository } from 'typeorm';
import { EntityNotFoundError } from 'typeorm';
import { Kategori } from 'src/kategori/entities/kategori.entity';
import { NotFoundError } from 'rxjs';



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

  findAll() {
    return this.produkRepository.findAndCount();
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


  // async updateProduk(id: string, updateProdukDto: UpdateProdukDto): Promise<Produk> {
  //   // Cek apakah produk dengan ID tertentu ada
  //   const produk = await this.produkRepository.findOne({ where: { id_produk: id } });
  //   if (!produk) {
  //     throw new NotFoundException(`Produk dengan id ${id} tidak ditemukan`);
  //   }

  //   // Update produk dengan properti yang diberikan
  //   Object.assign(produk, updateProdukDto);
  //   return await this.produkRepository.save(produk);
  // }

  async update(id: string, updateProdukDto: UpdateProdukDto) {
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
  }

  // async filterProdukByKategori(namaKategori: string): Promise<Produk[]> {
  //   try {
  //     const queryBuilder = this.produkRepository.createQueryBuilder('produk');

  //     queryBuilder
  //       .innerJoinAndSelect('produk.id_kategori', 'kategori')
  //       .where('kategori.nama = :namaKategori', { namaKategori });

  //     const produk = await queryBuilder.getMany();

  //     return produk;
  //   } catch (error) {
  //     console.error('Error fetching products by category:', error); // Log the error for debugging
  //     throw new InternalServerErrorException('Failed to filter products by category');
  //   }
  // }

  //   await this.produkRepository.update(id, updateProdukDto);

  //   return this.produkRepository.findOneOrFail({
  //     where: {
  //       id_produk: id,
  //     },
  //   });
  // }

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
