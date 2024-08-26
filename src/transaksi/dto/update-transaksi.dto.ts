import { PartialType } from '@nestjs/swagger';
import { CreateTransaksiDto } from './create-transaksi.dto';

export class UpdateTransaksiDto extends PartialType(CreateTransaksiDto) {}
