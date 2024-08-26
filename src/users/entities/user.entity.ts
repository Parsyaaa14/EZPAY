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

import { Role } from '../../role/entities/role.entity';
import { Produk } from '../../produk/entities/produk.entity';
import { Pesanan } from '../../pesanan/entities/pesanan.entity';
import { Transaksi } from '../../transaksi/entities/transaksi.entity';
import { Toko } from '../../toko/entities/toko.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id_user: string;

  @ManyToOne(() => Role, (role) => role.user)
  role: Role;

  @OneToMany(() => Produk, (produk) => produk.user)
  produk: Produk[];

  @OneToMany(() => Pesanan, (pesanan) => pesanan.user)
  pesanan: Pesanan[];

  @OneToMany(() => Transaksi, (transaksi) => transaksi.user)
  transaksi: Transaksi[];

  @OneToMany(() => Toko, (toko) => toko.user)
  toko: Toko[];

  @Column({ length: 50 })
  nama: string;

  @Column({ length: 50 })
  password: string;

  @Column({ length: 25 })
  no_handphone: string;

  @Column('uuid')
  salt: string;

  @Column({ length: 25 })
  status: string;

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
