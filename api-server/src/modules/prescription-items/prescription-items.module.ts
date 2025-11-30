import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PrescriptionItem } from './entities';
import { PrescriptionItemsService } from './prescription-items.service';
import { PrescriptionItemsController } from './prescription-items.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PrescriptionItem])],
  controllers: [PrescriptionItemsController],
  providers: [PrescriptionItemsService],
  exports: [PrescriptionItemsService],
})
export class PrescriptionItemsModule {}
