import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
  CreateDateColumn,
  ManyToMany,
  
} from 'typeorm';

import { Transaksi } from 'src/transaksi/entities/transaksi.entity';

@Entity()
export class MetodeTransaksi {
  @PrimaryGeneratedColumn('uuid')
  id_metode_transaksi: string;

  @ManyToMany(()=>Transaksi,(transaksi)=>transaksi.metodeTransaksi)
  transaksi:Transaksi[];

  @Column({ nullable: true })
  nama: string;

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

