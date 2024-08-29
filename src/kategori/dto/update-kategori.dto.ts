import { PartialType } from '@nestjs/swagger';
import { CreateKategoriDto } from './create-kategori.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateKategoriDto extends PartialType(CreateKategoriDto) {
    @IsString()
    @IsNotEmpty()
    nama?: string;
}
