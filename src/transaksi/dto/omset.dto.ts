import { IsOptional, IsString } from 'class-validator';

export class GetTransaksiFilterDto {
  @IsOptional()
  @IsString()
  period?: 'day' | 'week' | 'month' | 'year';
}
