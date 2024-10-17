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
  JoinColumn,
} from 'typeorm';

import { Produk } from '../../produk/entities/produk.entity';
import { Toko } from 'src/toko/entities/toko.entity';

@Entity()
export class Kategori {
  @PrimaryGeneratedColumn('uuid')
  id_kategori: string;

  @ManyToOne(() => Toko, (toko) => toko.kategori)
  @JoinColumn({ name: 'id_toko' })
  toko: Toko;

  @OneToMany(() => Produk, (produk) => produk.kategori)
  produk: Produk[];

  @Column({ type: 'varchar', length: 50, nullable: true })
  nama: string;

  @CreateDateColumn({ type: 'timestamp with time zone', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', nullable: false })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: false })
  deletedAt: Date;

  @VersionColumn()
  version: number;
}

