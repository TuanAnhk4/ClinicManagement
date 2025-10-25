import { Medicine } from 'src/medicines/entities/medicine.entity';
import { Prescription } from 'src/prescriptions/entities/prescription.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('prescription_items')
export class PrescriptionItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column()
  dosage: string; // Hướng dẫn sử dụng

  // Nhiều chi tiết thuộc về một đơn thuốc
  @ManyToOne(() => Prescription, { onDelete: 'CASCADE' }) // Nếu xóa đơn thuốc thì xóa luôn chi tiết
  prescription: Prescription;

  // Nhiều chi tiết liên quan đến một loại thuốc
  @ManyToOne(() => Medicine)
  medicine: Medicine;
}
