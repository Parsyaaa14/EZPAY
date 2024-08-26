import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
  CreateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Transaksi } from '../../transaksi/entities/transaksi.entity';
import { Toko } from '#/toko/entities/toko.entity';

@Entity()
export class Pesanan {
  @PrimaryGeneratedColumn('uuid')
  id_pesanan: string;

  @ManyToOne(() => User, (user) => user.pesanan)
  user?: User;

  @OneToOne(() => Transaksi, (transaksi) => transaksi.pesanan)
  transaksi: Transaksi;

  @OneToOne(() => Toko, (toko) => toko.pesanan)
  @JoinColumn()
  toko?: Toko;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: '0' })
  total_harga_pesanan: number;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    nullable: false,
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp with time zone',
    nullable: true,
  })
  deletedAt: Date;

  @VersionColumn()
  version: number;
}
