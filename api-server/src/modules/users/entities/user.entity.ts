import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

import { HashUtil } from '@common/utils';

import { Appointment } from '@modules/appointments/entities';
import { Specialty } from '@modules/specialties/entities';
import { DoctorSchedule } from '@/modules/doctor-schedules/entities';

import { UserRole, Gender } from '../enums';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  fullName: string;

  @Column({ unique: true, nullable: true })
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PATIENT,
  })
  role: UserRole;

  // ML Features
  @Column({ type: 'date', nullable: true })
  date_of_birth: Date;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @Column({ type: 'float', nullable: true })
  bmi: number;

  @Column({ type: 'boolean', default: false })
  is_smoker: boolean;

  @Column({ type: 'int', default: 0 })
  children: number;

  // ref
  @ManyToOne(() => Specialty, (specialty) => specialty.doctors, { nullable: true })
  @JoinColumn({ name: 'specialtyId' })
  specialty: Specialty;

  @OneToMany(() => DoctorSchedule, (schedule) => schedule.doctor)
  doctorSchedules: DoctorSchedule[];

  @Column({ nullable: true })
  specialtyId: number;

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointmentsAsPatient: Appointment[];

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointmentsAsDoctor: Appointment[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await HashUtil.hash(this.password);
  }
}
