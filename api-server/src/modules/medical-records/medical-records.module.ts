import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MedicalRecord } from './entities';
import { MedicalRecordsController } from './medical-records.controller';
import { MedicalRecordsService } from './medical-records.service';

import { Appointment } from '@modules/appointments/entities';
import { Prescription } from '@modules/prescriptions/entities';
import { PrescriptionItem } from '@modules/prescription-items/entities';
import { Medicine } from '@modules/medicines/entities';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalRecord, Appointment, Prescription, PrescriptionItem, Medicine])],
  controllers: [MedicalRecordsController],
  providers: [MedicalRecordsService],
})
export class MedicalRecordsModule {}
