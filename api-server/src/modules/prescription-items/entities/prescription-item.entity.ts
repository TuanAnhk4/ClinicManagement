import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, AfterLoad, Unique } from 'typeorm';

import { Medicine } from '@modules/medicines/entities';
import { Prescription } from '@modules/prescriptions/entities';

@Entity('prescription_items')
@Unique(['prescription', 'medicine'])
export class PrescriptionItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column()
  dosage: string;

  @ManyToOne(() => Prescription, { onDelete: 'CASCADE' })
  prescription: Prescription;

  @ManyToOne(() => Medicine)
  medicine: Medicine;

  // --- VIRTUAL COLUMN (Cột ảo - Không lưu vào DB) ---
  amount: number;

  @AfterLoad()
  calculateAmount() {
    if (this.medicine && this.medicine.price) {
      this.amount = this.quantity * Number(this.medicine.price);
    } else {
      this.amount = 0;
    }
  }
}
