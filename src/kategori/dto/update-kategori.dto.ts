import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateKategoriDto {
  @IsString()
  @IsNotEmpty()
  namaBaru: string;
}