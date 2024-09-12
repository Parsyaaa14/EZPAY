import { Test, TestingModule } from '@nestjs/testing';
import { MetodeTransaksiService } from './metode_transaksi.service';

describe('MetodeTransaksiService', () => {
  let service: MetodeTransaksiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MetodeTransaksiService],
    }).compile();

    service = module.get<MetodeTransaksiService>(MetodeTransaksiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
