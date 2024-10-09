import { Injectable } from '@nestjs/common';
import { CreateMetodeTransaksiDto } from './dto/create-metode_transaksi.dto';
import { UpdateMetodeTransaksiDto } from './dto/update-metode_transaksi.dto';
import { MetodeTransaksi } from './entities/metode_transaksi.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MetodeTransaksiService {
  constructor(
    @InjectRepository(MetodeTransaksi)
    private readonly metodeTransaksiRepository: Repository<MetodeTransaksi>,
  ) {}

  findAll() {
    return this.metodeTransaksiRepository.find();
  }
  create(createMetodeTransaksiDto: CreateMetodeTransaksiDto) {
    return 'This action adds a new metodeTransaksi';
  }

  findOne(id: number) {
    return `This action returns a #${id} metodeTransaksi`;
  }

  update(id: number, updateMetodeTransaksiDto: UpdateMetodeTransaksiDto) {
    return `This action updates a #${id} metodeTransaksi`;
  }

  remove(id: number) {
    return `This action removes a #${id} metodeTransaksi`;
  }
}
