import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  BeforeInsert,
  JoinColumn,
  BeforeUpdate,
} from 'typeorm';

import { Kategori } from '../../kategori/entities/kategori.entity';
import { User } from '../../users/entities/user.entity';
import { Toko } from 'src/toko/entities/toko.entity';
import { DetilProdukPesanan } from 'src/detil_produk_pesanan/entities/detil_produk_pesanan.entity';
import { v4 as uuidv4 } from 'uuid';

export enum StatusProduk {
  Aktif = 'aktif',
  TidakAktif = 'tidak aktif',
}
@Entity()
export class Produk {
  @PrimaryGeneratedColumn('uuid')
  id_produk: string;

  @ManyToOne(() => Kategori, (kategori) => kategori.produk)
  kategori: Kategori;
  

  @ManyToOne(() => User, (user) => user.produk)
  user?: User;

  @ManyToOne(() => Toko, (toko) => toko.produk)
  toko: Toko[];

  @OneToMany(() => DetilProdukPesanan, (detilProdukPesanan) => detilProdukPesanan.produk)
  detilProdukPesanan: DetilProdukPesanan[];

  @Column({ type: 'varchar', length: 100, nullable: false})
  nama_produk: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  harga_produk: number;

  @Column({ type: 'int'})
  stok: number;

  @Column({ type: 'text',nullable: true})
  gambar_produk: string;

  @Column({ type: 'varchar', length: 60})
  kode_produk: string;

  @Column({ type: 'varchar', length: 60})
  satuan_produk: string;

  @Column({ type: 'enum', enum: StatusProduk, default: StatusProduk.Aktif })
  status_produk: StatusProduk;


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

  @BeforeInsert()
  @BeforeInsert()
  generateKodeProduk() {
    // Fungsi untuk membuat kode produk dengan kombinasi huruf dan angka
    this.kode_produk = this.generateRandomCode();
  }

  // Fungsi untuk membuat kode 4 karakter acak campuran huruf dan angka
  private generateRandomCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Huruf dan angka
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
}
