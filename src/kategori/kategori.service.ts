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


@Injectable()
export class KategoriService {
  constructor(
    @InjectRepository(Kategori)
    private kategoriRepository: Repository<Kategori>,
    @InjectRepository(Produk)
    private produkRepository: Repository<Produk>,
  ) {}
  async create(createKategoriDto: CreateKategoriDto) {
    const kategori = new Kategori();
    kategori.nama = createKategoriDto.nama
    const result = await this.kategoriRepository.insert(kategori);
    
    return this.kategoriRepository.findOneOrFail({
      where: {
        id_kategori: result.identifiers[0].id,
      },
    });
  }

  async filterProdukByKategori(idKategori: string): Promise<Produk[]> {
    try {
      // Ambil produk berdasarkan id_kategori
      const produk = await this.produkRepository.find({
        where: { kategori: { id_kategori: idKategori } },
      });
  
      // Jika tidak ada produk, kembalikan array kosong
      if (produk.length === 0) {
        return [];  // Mengembalikan array kosong jika produk tidak ditemukan
      }
  
      return produk;
    } catch (error) {
      throw new Error(
        `Gagal memfilter produk berdasarkan kategori: ${error.message}`,
      );
    }
  }
  
    // Method untuk menghitung jumlah produk di dalam kategori
    async countProdukInKategori(): Promise<any[]> {
      try {
        const kategoriList = await this.kategoriRepository.find(); // Ambil semua kategori
        const produkCountPerKategori = [];
  
        for (const kategori of kategoriList) {
          const produkCount = await this.produkRepository.count({
            where: { kategori: { id_kategori: kategori.id_kategori } }, // Hitung produk berdasarkan kategori
          });
          produkCountPerKategori.push({
            kategori: kategori.nama,
            jumlahProduk: produkCount,
          });
        }
  
        return produkCountPerKategori;
      } catch (error) {
        throw new Error(`Gagal menghitung produk per kategori: ${error.message}`);
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

    // Fungsi untuk mengupdate nama kategori dan memperbarui nama di produk terkait
    async updateKategori(namaLama: string, updateKategoriDto: UpdateKategoriDto): Promise<void> {
      const { namaBaru } = updateKategoriDto;
  
      try {
        // Cari kategori berdasarkan nama lama
        const kategori = await this.kategoriRepository.findOne({
          where: { nama: namaLama },
          relations: ['produk'], // Ambil produk yang berelasi
        });
  
        if (!kategori) {
          throw new Error('Kategori tidak ditemukan');
        }
  
        // Update nama kategori
        kategori.nama = namaBaru;
        await this.kategoriRepository.save(kategori);
  
        // Update nama kategori di produk yang terkait
        const produkTerkait = await this.produkRepository.find({
          where: { kategori: { id_kategori: kategori.id_kategori } },
        });
  
        produkTerkait.forEach((produk) => {
          // Perbarui nama kategori di produk
          if (produk.kategori) {
            produk.kategori.nama = namaBaru;
          }
        });
  
        // Simpan perubahan pada produk
        await this.produkRepository.save(produkTerkait);
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
