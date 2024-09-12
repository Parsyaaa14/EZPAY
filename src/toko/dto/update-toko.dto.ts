import { PartialType } from '@nestjs/swagger';
import { CreateTokoDto } from './create-toko.dto';

export class UpdateTokoDto extends PartialType(CreateTokoDto) {}
