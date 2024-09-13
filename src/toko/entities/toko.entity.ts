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
  ManyToOne,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Produk } from 'src/produk/entities/produk.entity';
import { Pesanan } from 'src/pesanan/entities/pesanan.entity';
import { Matches } from 'class-validator';

export enum StatusToko {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}
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

  @Column({ type: 'varchar', length: 50,nullable: true})
  nama: string;

  @Column({ length: 50, nullable: true, unique: true})
  email: string;

  @Matches(/^[0-9]{10,15}$/, {
    message: 'no_handphone must be a valid phone number',
  })
  no_handphone: string;


  @Column({ type: "text", nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 60 })
  nama_toko: string;

  @Column({ type: 'varchar', length: 60 })
  alamat_toko: string;

  @Column({ type: 'text',nullable: true})
  foto: string;

  @Column({ type: 'varchar', length: 100 })
  deskripsi_toko: string;

  // @Column({ type: 'varchar', length: 100 })
  // alasan: string;
  
  @Column({
    type: 'enum',
    enum: StatusToko,
    default: StatusToko.PENDING,
  })
  status: StatusToko;

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
