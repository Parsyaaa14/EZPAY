import { Test, TestingModule } from '@nestjs/testing';
import { PesananController } from './pesanan.controller';
import { PesananService } from './pesanan.service';

describe('PesananController', () => {
  let controller: PesananController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PesananController],
      providers: [PesananService],
    }).compile();

    controller = module.get<PesananController>(PesananController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
