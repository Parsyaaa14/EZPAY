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
  
    // Mencari toko berdasarkan id_toko
    const toko = await this.tokoRepository.findOne({ where: { id_toko } });
    if (!toko) {
      throw new HttpException('Toko tidak ditemukan', HttpStatus.NOT_FOUND);
    }
  
    // Validasi apakah nama kategori sudah ada di toko yang sama
    const existingKategori = await this.kategoriRepository.findOne({
      where: {
        nama: createKategoriDto.nama,
        toko: { id_toko },  // Pastikan kategori tersebut milik toko yang sama
      },
    });
  
    if (existingKategori) {
      throw new HttpException('Nama kategori sudah ada', HttpStatus.BAD_REQUEST);
    }
  
    // Membuat kategori baru
    const kategori = new Kategori();
    kategori.nama = createKategoriDto.nama;
    kategori.toko = toko; // Assign toko
  
    // Simpan kategori ke database
    const result = await this.kategoriRepository.insert(kategori);
  
    // Mengembalikan kategori yang baru saja disimpan
    return this.kategoriRepository.findOneOrFail({
      where: {
        id_kategori: result.identifiers[0].id,
      },
    });
  }
  
  
  async filterProdukByKategori(
    idKategori: string,
    idToko: string,
  ): Promise<Produk[]> {
    try {
      const produk = await this.produkRepository.find({
        where: {
          kategori: { id_kategori: idKategori }, // Filter berdasarkan kategori
          toko: { id_toko: idToko }, // Tambahkan filter berdasarkan id_toko
        },
      });
  
      return produk.length ? produk : []; // Mengembalikan array kosong jika tidak ada produk
    } catch (error) {
      throw new Error(
        `Gagal memfilter produk berdasarkan kategori dan toko: ${error.message}`,
      );
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
            idKategori: kategori.id_kategori,
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
      throw new HttpException(
        `Gagal mengambil kategori: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findProdukByKategoriAndToko(
    kategoriId: string,
    id_toko: string,
  ): Promise<Produk[]> {
    try {
      const kategori = await this.kategoriRepository.findOne({
        where: { id_kategori: kategoriId, toko: { id_toko: id_toko } },
        relations: ['produk'], // Mengambil relasi produk
      });

      if (!kategori) {
        throw new HttpException(
          'Kategori tidak ditemukan untuk toko ini',
          HttpStatus.NOT_FOUND,
        );
      }

      return kategori.produk; // Mengembalikan produk yang terkait
    } catch (error) {
      throw new HttpException(
        `Gagal mengambil produk: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
            idKategori: kategori.id_kategori,
            kategori: kategori.nama,
            jumlahProduk: produkCount,
          };
        }),
      );

      return produkCountPerKategori;
    } catch (error) {
      throw new HttpException(
        `Gagal menghitung produk per kategori: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data tidak ditemukan',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      throw e;
    }
  }

  async updateKategori(idKategori: string, updateKategoriDto: UpdateKategoriDto): Promise<void> {
    const { namaBaru } = updateKategoriDto;

    if (!namaBaru) {
      throw new HttpException('Nama baru tidak boleh kosong', HttpStatus.BAD_REQUEST);
    }

    try {
      const kategori = await this.kategoriRepository.findOne({
        where: { id_kategori: idKategori },
        relations: ['produk'],
      });

      if (!kategori) {
        throw new HttpException('Kategori tidak ditemukan', HttpStatus.NOT_FOUND);
      }

      kategori.nama = namaBaru;
      await this.kategoriRepository.save(kategori);

      const produkTerkait = await this.produkRepository.find({
        where: { kategori: { id_kategori: kategori.id_kategori } },
      });

      await Promise.all(
        produkTerkait.map((produk) => {
          if (produk.kategori) {
            produk.kategori.nama = namaBaru;
            return this.produkRepository.save(produk);
          }
          return Promise.resolve();
        }),
      );
    } catch (error) {
      throw new HttpException(
        `Gagal memperbarui kategori: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  async findByName(nama: string): Promise<Kategori | null> {
    return this.kategoriRepository.findOne({ where: { nama: nama } });
  }

}
