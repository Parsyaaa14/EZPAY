import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

import { Kategori } from '../../kategori/entities/kategori.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Produk {
  @PrimaryGeneratedColumn('uuid')
  id_produk: string;

  @ManyToOne(() => Kategori, (kategori) => kategori.produk)
  kategori?: Kategori;

  @ManyToOne(() => User, (user) => user.produk)
  user?: User;

  @Column({ type: 'varchar', length: 100 })
  nama_produk: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  harga_produk: number;

  @Column({ type: 'int'})
  stok: number;

  @Column({ type: 'text'})
  gambar_produk: string;

  @Column({ type: 'varchar', length: 60})
  kode_produk: string;

  @Column({ type: 'varchar', length: 60})
  satuan_produk: string;

  @Column({ type: 'boolean' })
  status_produk: boolean;


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
