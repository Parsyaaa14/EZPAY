import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateKategoriDto } from './dto/create-kategori.dto';
import { UpdateKategoriDto } from './dto/update-kategori.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityNotFoundError } from 'typeorm';
import { Kategori } from './entities/kategori.entity';
import { Produk } from 'src/produk/entities/produk.entity';
import { Toko } from 'src/toko/entities/toko.entity';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';


@Injectable()
export class KategoriService {
  constructor(
    @InjectRepository(Kategori)
    private kategoriRepository: Repository<Kategori>,
    @InjectRepository(Produk)
    private produkRepository: Repository<Produk>,
    @InjectRepository(Toko)
    private tokoRepository: Repository<Toko>,
  ) {}

  async create(createKategoriDto: CreateKategoriDto, id_toko: string) {
    // Validasi id_toko sebagai UUID
    if (!uuidValidate(id_toko)) {
      throw new HttpException('ID Toko tidak valid', HttpStatus.BAD_REQUEST);
    }

    const toko = await this.tokoRepository.findOne({ where: { id_toko } });
    if (!toko) {
      throw new HttpException('Toko tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    const kategori = new Kategori();
    kategori.nama = createKategoriDto.nama;
    kategori.toko = toko; // Assign toko

    const result = await this.kategoriRepository.insert(kategori);
    
    return this.kategoriRepository.findOneOrFail({
      where: {
        id_kategori: result.identifiers[0].id,
      },
    });
  }
  

  async filterProdukByKategori(idKategori: string): Promise<Produk[]> {
    try {
      const produk = await this.produkRepository.find({
        where: { kategori: { id_kategori: idKategori } },
      });

      return produk.length ? produk : []; // Mengembalikan array kosong jika tidak ada produk
    } catch (error) {
      throw new Error(`Gagal memfilter produk berdasarkan kategori: ${error.message}`);
    }
  }

  async kategoriByToko(id_toko: string): Promise<any[]> {
    try {
      const kategoriList = await this.kategoriRepository.find({
        where: { toko: { id_toko: id_toko } }, // Pastikan ini sesuai dengan skema database
      });
      
      const produkCountPerKategori = await Promise.all(
        kategoriList.map(async (kategori) => {
          const produkCount = await this.produkRepository.count({
            where: { kategori: { id_kategori: kategori.id_kategori } },
          });
          return {
            kategori: kategori.nama,
            jumlahProduk: produkCount,
          };
        }),
      );

      return produkCountPerKategori;
    } catch (error) {
      throw new Error(`Gagal menghitung produk per kategori: ${error.message}`);
    }
  }

  async findAllByToko(id_toko: string): Promise<Kategori[]> {
    try {
      const kategoriList = await this.kategoriRepository.find({
        where: { toko: { id_toko: id_toko } }, // Memfilter berdasarkan ID toko
      });
      return kategoriList;
    } catch (error) {
      throw new HttpException(`Gagal mengambil kategori: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findProdukByKategoriAndToko(kategoriId: string, id_toko: string): Promise<Produk[]> {
    try {
      const kategori = await this.kategoriRepository.findOne({
        where: { id_kategori: kategoriId, toko: { id_toko: id_toko } },
        relations: ['produk'], // Mengambil relasi produk
      });

      if (!kategori) {
        throw new HttpException('Kategori tidak ditemukan untuk toko ini', HttpStatus.NOT_FOUND);
      }

      return kategori.produk; // Mengembalikan produk yang terkait
    } catch (error) {
      throw new HttpException(`Gagal mengambil produk: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async countProdukPerKategoriByToko(id_toko: string): Promise<any[]> {
    try {
      const kategoriList = await this.kategoriRepository.find({
        where: { toko: { id_toko: id_toko } }, // Memfilter berdasarkan ID toko
      });

      const produkCountPerKategori = await Promise.all(
        kategoriList.map(async (kategori) => {
          const produkCount = await this.produkRepository.count({
            where: { kategori: { id_kategori: kategori.id_kategori } },
          });

          return {
            kategori: kategori.nama,
            jumlahProduk: produkCount,
          };
        }),
      );

      return produkCountPerKategori;
    } catch (error) {
      throw new HttpException(`Gagal menghitung produk per kategori: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeKategoriByToko(id_kategori: string, id_toko: string) {
    try {
      const kategori = await this.kategoriRepository.findOne({
        where: { id_kategori, toko: { id_toko: id_toko } },
      });
  
      if (!kategori) {
        throw new HttpException('Kategori tidak ditemukan untuk toko ini', HttpStatus.NOT_FOUND);
      }
  
      await this.kategoriRepository.delete({ id_kategori });
    } catch (error) {
      throw new HttpException(`Gagal menghapus kategori: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findAll() {
    return this.kategoriRepository.findAndCount();
  }

  async findOne(id: string) {
    try {
      return await this.kategoriRepository.findOneOrFail({
        where: { id_kategori: id },
      });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new HttpException({
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Data tidak ditemukan',
        }, HttpStatus.NOT_FOUND);
      }
      throw e;
    }
  }

  async updateKategori(namaLama: string, updateKategoriDto: UpdateKategoriDto): Promise<void> {
    const { namaBaru } = updateKategoriDto;

    try {
      const kategori = await this.kategoriRepository.findOne({
        where: { nama: namaLama },
        relations: ['produk'],
      });

      if (!kategori) {
        throw new Error('Kategori tidak ditemukan');
      }

      kategori.nama = namaBaru;
      await this.kategoriRepository.save(kategori);

      const produkTerkait = await this.produkRepository.find({
        where: { kategori: { id_kategori: kategori.id_kategori } },
      });

      await Promise.all(produkTerkait.map((produk) => {
        if (produk.kategori) {
          produk.kategori.nama = namaBaru;
          return this.produkRepository.save(produk);
        }
        return Promise.resolve();
      }));
    } catch (error) {
      throw new Error(`Gagal memperbarui kategori: ${error.message}`);
    }
  }

  async findByName(nama: string): Promise<Kategori | null> {
    return this.kategoriRepository.findOne({ where: { nama: nama } });
  }

  async remove(id: string) {
    try {
      await this.kategoriRepository.findOneOrFail({
        where: { id_kategori: id },
      });
      await this.kategoriRepository.delete(id);
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new HttpException({
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Data tidak ditemukan',
        }, HttpStatus.NOT_FOUND);
      }
      throw e;
    }
  }
}
