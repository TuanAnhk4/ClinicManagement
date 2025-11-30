import { PrescriptionItem } from '../entities/prescription-item.entity';

export class PrescriptionItemResponse {
  medicineName: string;
  unit: string;
  quantity: number;
  dosage: string;
  price: number;
  amount: number;

  static fromEntity(entity: PrescriptionItem): PrescriptionItemResponse {
    return {
      medicineName: entity.medicine ? entity.medicine.name : 'Thuốc đã bị xóa',
      unit: entity.medicine ? entity.medicine.unit : '',
      price: entity.medicine ? Number(entity.medicine.price) : 0,
      quantity: entity.quantity,
      dosage: entity.dosage,
      amount: entity.amount || 0,
    };
  }
}
