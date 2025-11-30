import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Appointment } from './entities';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';

import { UsersModule } from '@modules/users/users.module';
import { User } from '@modules/users/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, User]), UsersModule],
  controllers: [AppointmentsController],

  providers: [AppointmentsService],
})
export class AppointmentsModule {}
