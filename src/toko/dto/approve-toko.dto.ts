import { IsEnum, IsNotEmpty } from 'class-validator';
import { StatusToko } from '../entities/toko.entity';

export class ApproveTokoDto {
  @IsEnum(StatusToko)
  @IsNotEmpty()
  status: StatusToko;
}