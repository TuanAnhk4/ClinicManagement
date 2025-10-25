import { PrescriptionItem } from '@/prescription-items/entities/prescription-item.entity';
import { MedicalRecord } from 'src/medical-records/entities/medical-record.entity';
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('prescriptions')
export class Prescription {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  // Một đơn thuốc thuộc về một hồ sơ khám bệnh
  @OneToOne(() => MedicalRecord)
  @JoinColumn()
  medicalRecord: MedicalRecord;

  @OneToMany(() => PrescriptionItem, (item) => item.prescription)
  items: PrescriptionItem[]; // Một đơn thuốc có nhiều chi tiết
}
