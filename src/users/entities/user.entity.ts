// import {
//   Entity,
//   Column,
//   PrimaryGeneratedColumn,
//   UpdateDateColumn,
//   DeleteDateColumn,
//   VersionColumn,
//   CreateDateColumn,
//   ManyToOne,

// } from 'typeorm';

// import { Role } from '../../role/entities/role.entity';


// @Entity()
// export class User {
//   @PrimaryGeneratedColumn('uuid')
//   id_user: string;

//   @Column({ length: 50 })
//   nama: string;

//   @ManyToOne(() => Role, (role) => role.user)
//   role: Role;
  
//   @Column({ length: 50 })
//   password: string;

//   @Column({ length: 25 })
//   no_handphone: string;

//   @Column('uuid')
//   salt: string;

//   @Column({ length: 25 })
//   status: string;

//   @CreateDateColumn({
//     type: 'timestamp with time zone',
//     nullable: false,
//   })
//   createdAt: Date;

//   @UpdateDateColumn({
//     type: 'timestamp with time zone',
//     nullable: false,
//   })
//   updatedAt: Date;

//   @DeleteDateColumn({
//     type: 'timestamp with time zone',
//     nullable: true,
//   })
//   deletedAt: Date;

//   @VersionColumn()
//   version: number;
// }

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Role } from '../../role/entities/role.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id_user: string;

  @Column({ length: 50 })
  nama: string;

  @Column({ length: 50 })
  password: string;

  @Column({ length: 25 })
  no_handphone: string;

  @Column({ type: 'uuid' })
  salt: string;

  @Column({ length: 25 })
  status: string;

  @ManyToOne(() => Role, (role) => role.user)
  role: Role;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;

  @Column()
  version: number;
}