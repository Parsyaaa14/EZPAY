import { Injectable } from '@nestjs/common';
import { DaftarDto } from './dto/daftar.dto';
// import { UpdateTokoDto } from './dto/update-toko.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusToko, Toko } from './entities/toko.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TokoService {
  constructor(
    @InjectRepository(Toko)
    private tokoRepository: Repository<Toko>,
  ) {}

  async registerToko(daftarDto: DaftarDto) {
    const { nama, email, no_handphone, password, nama_toko, deskripsi_toko, alamat_toko, foto } = daftarDto;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newToko = this.tokoRepository.create({
      nama,
      email,
      no_handphone,
      password: hashedPassword,
      nama_toko,
      deskripsi_toko,
      alamat_toko,
      foto,
      status: StatusToko.PENDING, // Set status to pending
    });

    return this.tokoRepository.save(newToko);
  }

  async getPendingRegistrations() {
    return this.tokoRepository.find({ where: { status: StatusToko.PENDING } });
  }

  async approveRegistration(id: number) {
    return this.tokoRepository.update(id, { status: StatusToko.APPROVED });
  }

  async rejectRegistration(id: number) {
    return this.tokoRepository.update(id, { status: StatusToko.REJECTED });
  }

}

