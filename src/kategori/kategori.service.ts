import { Injectable, HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { CreateKategoriDto } from './dto/create-kategori.dto';
import { UpdateKategoriDto } from './dto/update-kategori.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityNotFoundError } from 'typeorm';
import { Kategori } from './entities/kategori.entity';
import { Produk } from 'src/produk/entities/produk.entity';

@Injectable()
export class KategoriService {

  constructor(
    @InjectRepository(Kategori)
    private kategoriRepository: Repository<Kategori>,
    @InjectRepository(Produk)
    private produkRepository: Repository<Produk>,
  ) {}
  async create(createKategoriDto: CreateKategoriDto) {
    const result = await this.kategoriRepository.insert(createKategoriDto);
    return this.kategoriRepository.findOneOrFail({
      where: {
        id_kategori: result.identifiers[0].id,
      }      
    })
  }

  async filterProdukByKategori(namaKategori: string): Promise<Produk[]> {
    try {
      // Cari kategori berdasarkan nama
      const kategori = await this.kategoriRepository.findOne({ where: { nama: namaKategori } });

      if (!kategori) {
        throw new Error('Kategori tidak ditemukan');
      }

      // Ambil produk berdasarkan id_kategori
      const produk = await this.produkRepository.find({
        where: { kategori: { id_kategori: kategori.id_kategori } },
      });

      return produk;
    } catch (error) {
      throw new Error(`Gagal memfilter produk berdasarkan kategori: ${error.message}`);
    }
  }

  findAll() {
    return this.kategoriRepository.findAndCount();
  }

  async findOne(id: string) {
    try {
      return await this.kategoriRepository.findOneOrFail({
        where: {
          id_kategori: id,
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

  async update(id: string, updateKategoriDto: UpdateKategoriDto) {
    try {
      await this.kategoriRepository.findOneOrFail({
        where: {
          id_kategori: id,
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
  

  await this.kategoriRepository.update(id, updateKategoriDto);

  return this.kategoriRepository.findOneOrFail({
    where: {
      id_kategori: id,
    },
  });
}

  async remove(id: string) {
    try {
      await this.kategoriRepository.findOneOrFail({
        where: {
          id_kategori: id,
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
}
