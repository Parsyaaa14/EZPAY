import { Injectable } from '@nestjs/common';
import { CreateTransaksiDto } from './dto/create-transaksi.dto';
import { UpdateTransaksiDto } from './dto/update-transaksi.dto';

@Injectable()
export class TransaksiService {
  create(createTransaksiDto: CreateTransaksiDto) {
    return 'This action adds a new transaksi';
  }

  findAll() {
    return `This action returns all transaksi`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaksi`;
  }

  update(id: number, updateTransaksiDto: UpdateTransaksiDto) {
    return `This action updates a #${id} transaksi`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaksi`;
  }
}
