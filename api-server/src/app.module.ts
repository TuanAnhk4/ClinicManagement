import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { AppointmentsModule } from '@modules/appointments/appointments.module';
import { MedicalRecordsModule } from '@modules/medical-records/medical-records.module';
import { MedicinesModule } from '@modules/medicines/medicines.module';
import { DashboardModule } from '@modules/dashboard/dashboard.module';
import { SpecialtiesModule } from '@modules/specialties/specialties.module';
import { DoctorSchedulesModule } from '@modules/doctor-schedules/doctor-schedules.module';

import { Appointment } from '@modules/appointments/entities';
import { Medicine } from '@modules/medicines/entities';
import { MedicalRecord } from '@modules/medical-records/entities';
import { Prescription } from '@modules/prescriptions/entities';
import { PrescriptionItem } from '@modules/prescription-items/entities';
import { Specialty } from '@modules/specialties/entities';
import { User } from '@modules/users/entities';
import { DoctorSchedule } from '@modules/doctor-schedules/entities';

import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@common/guards';

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
        entities: [
          User,
          Appointment,
          Medicine,
          MedicalRecord,
          Prescription,
          PrescriptionItem,
          Specialty,
          DoctorSchedule,
        ],
        synchronize: true, //TypeORM auto update db tables
      }),
    }),

    AuthModule,
    UsersModule,
    AppointmentsModule,
    MedicalRecordsModule,
    MedicinesModule,
    DashboardModule,
    SpecialtiesModule,
    DoctorSchedulesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Kích hoạt bảo vệ toàn bộ ứng dụng
    },
    // ... các providers khác
  ],
})
export class AppModule {}
