import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

import { Produk } from '../../produk/entities/produk.entity';
import { Pesanan } from '../../pesanan/entities/pesanan.entity';

@Entity()
export class DetilProdukPesanan {
  @PrimaryGeneratedColumn('uuid')
  id_detil: string;

  @ManyToOne(() => Produk, (produk) => produk.detilProdukPesanan)
  produk: Produk;

  @ManyToOne(() => Pesanan, (pesanan) => pesanan.detilProdukPesanan)
  pesanan: Pesanan;

  @Column({ type: 'int', default: 0 })
  jumlah_produk: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: '0' })
  total_harga_produk: number;

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
