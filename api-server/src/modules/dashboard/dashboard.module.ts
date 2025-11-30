import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

import { Appointment } from '@modules/appointments/entities';
import { MedicalRecord } from '@modules/medical-records/entities';
import { User } from '@modules/users/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, MedicalRecord, User])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
