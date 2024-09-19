import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { EntityTarget } from 'typeorm/common/EntityTarget';
import { DataSource } from 'typeorm';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import { ConfigService } from '@nestjs/config';
// import { User } from 'src/users/entities/user.entity';
// import { levelMasterData3} from './data/user';
import { levelMasterData } from './data/role';
import { levelMasterData2 } from './data/kategori';
import { Role } from 'src/role/entities/role.entity';
// import { Kategori } from 'src/kategori/entities/kategori.entity';
// import { Produk } from '#/produk/entities/produk.entity';
import { Pesanan } from 'src/pesanan/entities/pesanan.entity';
import { Toko } from 'src/toko/entities/toko.entity';
// import { levelMasterData4 } from './data/produk';
import { levelMasterData5 } from './data/pesanan';
import { levelMasterData6 } from './data/toko';
import { levelMasterData7 } from './data/metode_transaksi';
import { MetodeTransaksi } from 'src/metode_transaksi/entities/metode_transaksi.entity';
import { DetilProdukPesanan } from 'src/detil_produk_pesanan/entities/detil_produk_pesanan.entity';
import { levelMasterData8 } from './data/detil_produk_pesanan';


// import { userMasterData } from './data/user';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  private logger = new Logger(SeederService.name);

  constructor(
    private dataSource: DataSource,
    private configService: ConfigService,
  ) {}

  private async insertIfNotExist<Entity extends ObjectLiteral>(
    entity: EntityTarget<Entity>,
    data: Entity[],
  ) {
    for (const datas of data) {
      const existingRecord = await this.dataSource.manager.findOne(entity, {
        where: datas,
      });

      if (!existingRecord) {
        await this.dataSource
          .createQueryBuilder()
          .insert()
          .into(entity)
          .values(datas)
          .execute();
      }
    }
  }

  private async updateOrInsert<Entity extends ObjectLiteral>(
    entity: EntityTarget<Entity>,
    data: Entity[],
  ) {
    for (const datum of data) {
      await this.dataSource.manager.upsert(entity, datum, ['id']);
    }
  }

  async seeder() {
    await this.insertIfNotExist(Role, levelMasterData);
    // await this.insertIfNotExist(Kategori, levelMasterData2);
    // await this.insertIfNotExist(User, levelMasterData3);
    // await this.insertIfNotExist(Produk, levelMasterData4)
    await this.insertIfNotExist(Pesanan, levelMasterData5)
    await this.insertIfNotExist(MetodeTransaksi, levelMasterData7)
    await this.insertIfNotExist(DetilProdukPesanan, levelMasterData8)

    // await this.insertIfNotExist(Cities, cityMasterData)
  }

  async onApplicationBootstrap() {
    if (this.configService.get('env') === 'development') {
      await this.seeder();
      this.logger.log('Seeder run successfully');
    }
  }
}