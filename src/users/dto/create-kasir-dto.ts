import { IsString, IsNotEmpty } from 'class-validator';

export class CreateKasirDto {
  @IsNotEmpty()
  readonly nama: string;

  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly no_handphone: string;
}
