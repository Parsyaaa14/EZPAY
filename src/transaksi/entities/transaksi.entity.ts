import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Pesanan } from '../../pesanan/entities/pesanan.entity';
import { MetodeTransaksi } from '../../metode_transaksi/entities/metode_transaksi.entity';
import { Toko } from '../../toko/entities/toko.entity'


@Entity()
export class Transaksi {
  @PrimaryGeneratedColumn('uuid')
  id_transaksi: string;

  @ManyToOne(() => User, (user) => user.transaksi, { nullable: true })
  user?: User;

  @OneToOne(() => Pesanan, (pesanan) => pesanan.transaksi, { eager: true })
  @JoinColumn()
  pesanan: Pesanan;

  @ManyToOne(() => Toko, (toko) => toko.transaksi)
  @JoinColumn({ name: 'id_toko' })
  toko: Toko;

  @ManyToMany(() => MetodeTransaksi, (metodeTransaksi) => metodeTransaksi.transaksi)
  @JoinTable({ name: 'transaksi_metode' }) // Menentukan tabel junction untuk relasi Many-to-Many
  metodeTransaksi: MetodeTransaksi[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalHarga: number;

  @CreateDateColumn({ type: 'timestamp with time zone', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', nullable: false })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedAt: Date;

  @VersionColumn()
  version: number;
}