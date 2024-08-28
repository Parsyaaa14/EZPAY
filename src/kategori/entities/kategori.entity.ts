import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

import { Produk } from '../../produk/entities/produk.entity';

@Entity()
export class Kategori {
  @PrimaryGeneratedColumn('uuid')
  id_kategori: string;

  @OneToMany(() => Produk, (produk) => produk.kategori)
  produk: Produk[];

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
