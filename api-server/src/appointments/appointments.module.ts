import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { UsersModule } from 'src/users/users.module'; // Import UsersModule
import { User } from '@/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, User]),
    UsersModule, // Cần thiết để các guard có thể truy cập UsersService
  ],
  controllers: [AppointmentsController],

  providers: [AppointmentsService],
})
export class AppointmentsModule {}
