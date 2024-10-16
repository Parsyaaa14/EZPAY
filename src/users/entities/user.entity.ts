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
  BeforeInsert,
  AfterLoad,
} from 'typeorm';

import { Role } from '../../role/entities/role.entity';
import { Produk } from '../../produk/entities/produk.entity';
import { Pesanan } from '../../pesanan/entities/pesanan.entity';
import { Transaksi } from '../../transaksi/entities/transaksi.entity';
import { Toko } from '../../toko/entities/toko.entity';
import * as crypto from 'crypto';
// import  { v4 as uuidv4 } from 'uuid';


export enum StatusUser {
  Aktif = 'aktif',
  TidakAktif = 'tidak aktif',
}
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id_user: string;

  @ManyToOne(() => Role, (role) => role.user, { eager: true })
  role: Role;

  @OneToMany(() => Produk, (produk) => produk.user)
  produk: Produk[];

  @OneToMany(() => Pesanan, (pesanan) => pesanan.user)
  pesanan: Pesanan[];

  @OneToMany(() => Transaksi, (transaksi) => transaksi.user)
  transaksi: Transaksi[];

  @ManyToOne(() => Toko, (toko) => toko.user)
  toko: Toko;

  @Column({ type: 'varchar', length: 50 })
  nama: string;

  @Column({ type: "text", nullable: true })
  password: string;

  @Column({ length: 50, nullable: true, unique: true})
  email: string;

  @Column({ length: 25, nullable: true})
  no_handphone: string;

  @Column({ nullable: true })
  salt: string;

  // @Column({ type: 'boolean', default:true})
  // status: boolean;

  @Column ({ type: 'enum', enum: StatusUser, default: StatusUser.Aktif })
  status: StatusUser;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date;  // Kolom untuk menyimpan waktu login terakhir

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
  generateSalt() {
    // Generate salt menggunakan crypto random bytes
    this.salt = crypto.randomBytes(16).toString('hex');
  }
  //   generatePassword(): string {
  //   return crypto.randomBytes(8).toString('hex');
  // }

  private originalRole: Role;

  @AfterLoad()
  private loadOriginalRole() {
    this.originalRole = this.role;
  }

  // Ensure that the role is not changed after creation
  public setRole(role: Role) {
    if (this.originalRole && this.originalRole.nama !== 'Kasir') {
      throw new Error('Role tidak dapat diubah setelah user dibuat');
    }
    if (this.originalRole && this.originalRole.nama !== 'Admin') {
      throw new Error('Role tidak dapat diubah setelah user dibuat');
    }
    this.role = role;
  }

  // @BeforeInsert()
  // async hashPassword() {
  //   if (this.password) {
  //     this.password = await bcrypt.hash(this.password, 10);
  //   }
  // }
}
