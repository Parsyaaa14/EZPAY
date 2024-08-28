import { Injectable } from '@nestjs/common';
import { CreateDetilProdukPesananDto } from './dto/create-detil_produk_pesanan.dto';
import { UpdateDetilProdukPesananDto } from './dto/update-detil_produk_pesanan.dto';

@Injectable()
export class DetilProdukPesananService {
  create(createDetilProdukPesananDto: CreateDetilProdukPesananDto) {
    return 'This action adds a new detilProdukPesanan';
  }

  findAll() {
    return `This action returns all detilProdukPesanan`;
  }

  findOne(id: number) {
    return `This action returns a #${id} detilProdukPesanan`;
  }

  update(id: number, updateDetilProdukPesananDto: UpdateDetilProdukPesananDto) {
    return `This action updates a #${id} detilProdukPesanan`;
  }

  remove(id: number) {
    return `This action removes a #${id} detilProdukPesanan`;
  }
}
