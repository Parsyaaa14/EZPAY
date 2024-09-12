import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateDetilProdukPesananDto } from './dto/create-detil_produk_pesanan.dto';
import { UpdateDetilProdukPesananDto } from './dto/update-detil_produk_pesanan.dto';
import { DetilProdukPesanan } from './entities/detil_produk_pesanan.entity';
import { Repository, EntityNotFoundError } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class DetilProdukPesananService {

  constructor(
    @InjectRepository(DetilProdukPesanan)
    private detilProdukPesananRepository: Repository<DetilProdukPesanan>,
  ) {}
  async create(createDetilProdukPesananDto: CreateDetilProdukPesananDto) {
    const result = await this.detilProdukPesananRepository.insert(createDetilProdukPesananDto);

    return this.detilProdukPesananRepository.findOneOrFail({
      where: {
        id_detil: result.identifiers[0].id,
      },
    });
  }

  findAll() {
    return this.detilProdukPesananRepository.findAndCount();
  }

  async findOne(id: string) {
    try {
      return await this.detilProdukPesananRepository.findOneOrFail({
        where: {
          id_detil: id,
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

  async update(id: string, updateUserDto: UpdateDetilProdukPesananDto) {
    try {
      await this.detilProdukPesananRepository.findOneOrFail({
        where: {
          id_detil: id,
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

    await this.detilProdukPesananRepository.update(id, updateUserDto);

    return this.detilProdukPesananRepository.findOneOrFail({
      where: {
        id_detil: id,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} detilProdukPesanan`;
  }
}
