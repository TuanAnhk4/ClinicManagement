import { Expose, Type } from 'class-transformer';

import { Prescription } from '../entities';
import { PrescriptionItemResponse } from '@modules/prescription-items/dtos';

export class PrescriptionResponseDto {
  @Expose()
  id: number;

  @Expose()
  createdAt: Date;

  @Expose()
  medicalRecordId: number;

  @Expose()
  @Type(() => PrescriptionItemResponse)
  items: PrescriptionItemResponse[];

  @Expose()
  totalAmount: number;

  static fromEntity(entity: Prescription): PrescriptionResponseDto {
    const dto = new PrescriptionResponseDto();
    dto.id = entity.id;
    dto.createdAt = entity.createdAt;
    dto.medicalRecordId = entity.medicalRecordId;

    if (entity.items) {
      // Map từng dòng thuốc sang DTO chi tiết
      dto.items = entity.items.map((item) => PrescriptionItemResponse.fromEntity(item));

      // Tính tổng tiền đơn thuốc (Cộng dồn amount của từng item)
      dto.totalAmount = dto.items.reduce((sum, item) => sum + (item.amount || 0), 0);
    } else {
      dto.items = [];
      dto.totalAmount = 0;
    }

    return dto;
  }
}
