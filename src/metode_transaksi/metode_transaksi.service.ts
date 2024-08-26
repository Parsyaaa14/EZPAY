import { Injectable } from '@nestjs/common';
import { CreateMetodeTransaksiDto } from './dto/create-metode_transaksi.dto';
import { UpdateMetodeTransaksiDto } from './dto/update-metode_transaksi.dto';

@Injectable()
export class MetodeTransaksiService {
  create(createMetodeTransaksiDto: CreateMetodeTransaksiDto) {
    return 'This action adds a new metodeTransaksi';
  }

  findAll() {
    return `This action returns all metodeTransaksi`;
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
