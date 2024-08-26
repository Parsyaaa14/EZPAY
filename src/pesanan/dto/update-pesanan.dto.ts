import { PartialType } from '@nestjs/swagger';
import { CreatePesananDto } from './create-pesanan.dto';

export class UpdatePesananDto extends PartialType(CreatePesananDto) {}
