import { Injectable, HttpException,HttpStatus, NotFoundException } from '@nestjs/common';
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

    await this.produkRepository.update(id, updateProdukDto);

    return this.produkRepository.findOneOrFail({
      where: {
        id_produk: id,
      },
    });
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
