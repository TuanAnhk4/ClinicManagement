import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  appointmentTime: Date;

  @Column()
  endTime: Date; // Thêm cột này để kiểm tra trùng lặp dễ dàng

  @Column({ type: 'text', nullable: true })
  reason: string | null;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.CONFIRMED,
  })
  status: AppointmentStatus;

  @ManyToOne(() => User, (user) => user.appointmentsAsPatient)
  patient: User;

  @ManyToOne(() => User, (user) => user.appointmentsAsDoctor)
  doctor: User;
}
