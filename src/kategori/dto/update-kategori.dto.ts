import { PartialType } from '@nestjs/swagger';
import { CreateKategoriDto } from './create-kategori.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateKategoriDto {
    @IsNotEmpty()
    namaBaru: string;
  }