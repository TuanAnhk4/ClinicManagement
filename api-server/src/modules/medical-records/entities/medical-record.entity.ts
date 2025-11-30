import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Appointment } from '@modules/appointments/entities';
import { Prescription } from '@modules/prescriptions/entities';

@Entity('medical_records')
export class MedicalRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  diagnosis: string;

  @Column({ type: 'text', nullable: true })
  symptoms: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  // ref

  @Column({ unique: true })
  appointmentId: number;

  @OneToOne(() => Appointment)
  @JoinColumn({ name: 'appointmentId' })
  appointment: Appointment;

  @OneToOne(() => Prescription, (prescription) => prescription.medicalRecord)
  prescription: Prescription;

  // --- ML FEATURE ---
  @Column({ type: 'decimal', precision: 10, scale: 0, nullable: true })
  total_cost: number;

  // --- AUDIT ---
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
