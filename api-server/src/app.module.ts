import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';
import { User } from '@/users/entities/user.entity'; // Import User Entity
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppointmentsModule } from '@/appointments/appointments.module';
import { Appointment } from '@/appointments/entities/appointment.entity';
import { Medicine } from '@/medicines/entities/medicine.entity';
import { MedicalRecord } from '@/medical-records/entities/medical-record.entity';
import { MedicalRecordsModule } from './medical-records/medical-records.module';
import { Prescription } from '@/prescriptions/entities/prescription.entity';
import { PrescriptionItem } from '@/prescription-items/entities/prescription-item.entity';
import { MedicinesModule } from './medicines/medicines.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, Appointment, Medicine, MedicalRecord, Prescription, PrescriptionItem],
        synchronize: true,
      }),
    }),

    // 2. CÁC MODULE TÍNH NĂNG
    AuthModule,
    UsersModule,
    AppointmentsModule,
    MedicalRecordsModule,
    MedicinesModule,
  ],
})
export class AppModule {}
