import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
  CreateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Produk } from '#/produk/entities/produk.entity';
import { Pesanan } from '#/pesanan/entities/pesanan.entity';
@Entity()
export class Toko {
  @PrimaryGeneratedColumn('uuid')
  id_toko: string;

  @OneToMany(() => Produk, (produk) => produk.toko)
  produk?: Produk[];

  @OneToOne(() => Pesanan, (pesanan) => pesanan.toko)
  pesanan: Pesanan;

  @ManyToOne(() => User, (user) => user.toko)
  user: User;

  @Column({ type: 'varchar', length: 60 })
  nama_toko: string;

  @Column({ type: 'varchar', length: 60 })
  alamat_toko: string;

  @Column({ type: 'text' })
  gambar_toko: string;

  @Column({ type: 'varchar', length: 100 })
  deskripsi_toko: string;

  @Column({ type: 'varchar', length: 100 })
  alasan: string;

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
