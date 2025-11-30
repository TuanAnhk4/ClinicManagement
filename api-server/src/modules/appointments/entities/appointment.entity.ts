import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '@modules/users/entities';
import { AppointmentStatus } from '../enums';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  appointmentTime: Date;

  @Column()
  endTime: Date;

  @Column({ type: 'text', nullable: true })
  reason: string | null;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.CONFIRMED,
  })
  status: AppointmentStatus;

  @Column({ default: false })
  isReminderSent: boolean;

  // ref
  @ManyToOne(() => User, (user) => user.appointmentsAsPatient)
  @JoinColumn({ name: 'patientId' })
  patient: User;

  @Column()
  patientId: number;

  @ManyToOne(() => User, (user) => user.appointmentsAsDoctor)
  @JoinColumn({ name: 'doctorId' })
  doctor: User;

  @Column()
  doctorId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
