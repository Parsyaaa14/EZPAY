import {
  Entity,
  // Column,
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
  Column,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Pesanan } from '../../pesanan/entities/pesanan.entity';
import { MetodeTransaksi } from '../../metode_transaksi/entities/metode_transaksi.entity';

@Entity()
export class Transaksi {
  @PrimaryGeneratedColumn('uuid')
  id_transaksi: string;

  @ManyToMany(
    () => MetodeTransaksi,
    (metodeTransaksi) => metodeTransaksi.transaksi,
  )
  @JoinTable({ name: 'transaksi_metode' })
  metodeTransaksi: MetodeTransaksi[];

  @ManyToOne(() => User, (user) => user.transaksi)
  user?: User;

  @OneToOne(() => Pesanan, (pesanan) => pesanan.transaksi, { eager: true })
  @JoinColumn() // Digunakan untuk menentukan kolom yang menjadi referensi hubungan one-to-one
  pesanan: Pesanan; // Relasi OneToOne, satu transaksi hanya memiliki satu pesanan

  @Column({ type: 'decimal', precision: 10, scale: 2, default: '0' })
  totalHarga: number; // Properti ini harus ada di sini
  
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
