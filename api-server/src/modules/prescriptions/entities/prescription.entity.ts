import { Entity, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn, OneToMany, Column } from 'typeorm';

import { PrescriptionItem } from '@modules/prescription-items/entities';
import { MedicalRecord } from '@modules/medical-records/entities';

@Entity('prescriptions')
export class Prescription {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ unique: true })
  medicalRecordId: number;

  @OneToOne(() => MedicalRecord, (medicalRecord) => medicalRecord.prescription)
  @JoinColumn({ name: 'medicalRecordId' })
  medicalRecord: MedicalRecord;

  @OneToMany(() => PrescriptionItem, (item) => item.prescription)
  items: PrescriptionItem[];
}
