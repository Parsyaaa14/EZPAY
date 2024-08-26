import { Injectable } from '@nestjs/common';
import { CreatePesananDto } from './dto/create-pesanan.dto';
import { UpdatePesananDto } from './dto/update-pesanan.dto';

@Injectable()
export class PesananService {
  create(createPesananDto: CreatePesananDto) {
    return 'This action adds a new pesanan';
  }

  findAll() {
    return `This action returns all pesanan`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pesanan`;
  }

  update(id: number, updatePesananDto: UpdatePesananDto) {
    return `This action updates a #${id} pesanan`;
  }

  remove(id: number) {
    return `This action removes a #${id} pesanan`;
  }
}
