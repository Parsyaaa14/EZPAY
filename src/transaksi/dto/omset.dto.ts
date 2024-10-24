import { IsEnum, IsOptional, IsString } from 'class-validator';


export enum Period {
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  THIS_WEEK = 'this_week',
  LAST_WEEK = 'last_week',
  THIS_MONTH = 'this_month',
  LAST_MONTH = 'last_month',
  LAST_30_DAYS = 'last_30_days',
  THIS_QUARTER = 'this_quarter',
  LAST_QUARTER = 'last_quarter',
  THIS_YEAR = 'this_year',
  LAST_YEAR = 'last_year',
}

export class GetTransaksiFilterDto {
  @IsOptional()
  @IsEnum(Period, { message: 'Invalid period specified' })
  period?: Period;

  @IsOptional()
  @IsString()
  id_toko?: string; // Tambahkan id_toko sebagai parameter filter
}
