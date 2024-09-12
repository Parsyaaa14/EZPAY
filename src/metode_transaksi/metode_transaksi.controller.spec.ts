import { Test, TestingModule } from '@nestjs/testing';
import { MetodeTransaksiController } from './metode_transaksi.controller';
import { MetodeTransaksiService } from './metode_transaksi.service';

describe('MetodeTransaksiController', () => {
  let controller: MetodeTransaksiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetodeTransaksiController],
      providers: [MetodeTransaksiService],
    }).compile();

    controller = module.get<MetodeTransaksiController>(MetodeTransaksiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
