import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Prescription } from '@/prescriptions/entities/prescription.entity';
@Entity('medical_records')
export class MedicalRecord {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'text' }) diagnosis: string; // Chẩn đoán
  @Column({ type: 'text', nullable: true }) symptoms: string; // Triệu chứng
  @Column({ type: 'text', nullable: true }) notes: string; // Ghi chú thêm
  @OneToOne(() => Appointment)
  @JoinColumn()
  appointment: Appointment;

  @OneToOne(() => Prescription, (prescription) => prescription.medicalRecord) // Chỉ định quan hệ ngược lại
  prescription: Prescription;
}
