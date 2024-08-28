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
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Pesanan } from '../../pesanan/entities/pesanan.entity';
import { MetodeTransaksi } from '../../metode_transaksi/entities/metode_transaksi.entity';

@Entity()
export class Transaksi {
  @PrimaryGeneratedColumn('uuid')
  id_transaksi: string;

  @ManyToMany(() => MetodeTransaksi, (metodeTransaksi) => metodeTransaksi.transaksi)
  @JoinColumn()
  metodeTransaksi: MetodeTransaksi[];

  @ManyToOne(() => User, (user) => user.transaksi)
  user?: User;

  @OneToOne(() => Pesanan, (pesanan) => pesanan.transaksi)
  @JoinColumn()
  pesanan?: Pesanan;

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
