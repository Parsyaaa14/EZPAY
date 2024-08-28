import { Test, TestingModule } from '@nestjs/testing';
import { DetilProdukPesananController } from './detil_produk_pesanan.controller';
import { DetilProdukPesananService } from './detil_produk_pesanan.service';

describe('DetilProdukPesananController', () => {
  let controller: DetilProdukPesananController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetilProdukPesananController],
      providers: [DetilProdukPesananService],
    }).compile();

    controller = module.get<DetilProdukPesananController>(DetilProdukPesananController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
