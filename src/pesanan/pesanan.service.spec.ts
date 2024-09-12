import { Test, TestingModule } from '@nestjs/testing';
import { PesananService } from './pesanan.service';

describe('PesananService', () => {
  let service: PesananService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PesananService],
    }).compile();

    service = module.get<PesananService>(PesananService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
