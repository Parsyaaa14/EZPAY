import { Injectable } from '@nestjs/common';
import { CreateTokoDto } from './dto/create-toko.dto';
import { UpdateTokoDto } from './dto/update-toko.dto';

@Injectable()
export class TokoService {
  create(createTokoDto: CreateTokoDto) {
    return 'This action adds a new toko';
  }

  findAll() {
    return `This action returns all toko`;
  }

  findOne(id: number) {
    return `This action returns a #${id} toko`;
  }

  update(id: number, updateTokoDto: UpdateTokoDto) {
    return `This action updates a #${id} toko`;
  }

  remove(id: number) {
    return `This action removes a #${id} toko`;
  }
}
