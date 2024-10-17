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
  OneToMany,
  ManyToMany,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Transaksi } from '../../transaksi/entities/transaksi.entity';
import { Toko } from 'src/toko/entities/toko.entity';
import { DetilProdukPesanan } from 'src/detil_produk_pesanan/entities/detil_produk_pesanan.entity';

@Entity()
export class Pesanan {
  @PrimaryGeneratedColumn('uuid')
  id_pesanan: string;

  @ManyToMany(() => User, (user) => user.pesanan)
  user?: User;
  
  @OneToOne(() => Transaksi, (transaksi) => transaksi.pesanan)
  transaksi: Transaksi; // Relasi OneToOne, satu pesanan hanya memiliki satu transaksi

  @OneToOne(() => Toko, (toko) => toko.pesanan)
  @JoinColumn()
  toko?: Toko;

  @OneToMany(
    () => DetilProdukPesanan,
    (detilProdukPesanan) => detilProdukPesanan.pesanan,
    { cascade: true },
  )
  detilProdukPesanan: DetilProdukPesanan[];

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
