import { Module } from '@nestjs/common';
import { TokoService } from './toko.service';
import { TokoController } from './toko.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [TokoController],
  providers: [TokoService]
})
export class TokoModule {}
