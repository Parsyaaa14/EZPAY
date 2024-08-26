import { PartialType } from '@nestjs/swagger';
import { CreateMetodeTransaksiDto } from './create-metode_transaksi.dto';

export class UpdateMetodeTransaksiDto extends PartialType(CreateMetodeTransaksiDto) {}
