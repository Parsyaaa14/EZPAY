import { Test, TestingModule } from '@nestjs/testing';
import { DetilProdukPesananService } from './detil_produk_pesanan.service';

describe('DetilProdukPesananService', () => {
  let service: DetilProdukPesananService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetilProdukPesananService],
    }).compile();

    service = module.get<DetilProdukPesananService>(DetilProdukPesananService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
