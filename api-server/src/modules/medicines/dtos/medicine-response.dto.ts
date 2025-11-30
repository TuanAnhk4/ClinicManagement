import { Medicine } from '../entities';

export class MedicineResponseDto {
  id: number;
  name: string;
  unit: string;
  description: string;
  price: number;

  static fromEntity(entity: Medicine): MedicineResponseDto {
    const dto = new MedicineResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.unit = entity.unit;
    dto.description = entity.description || '';

    dto.price = entity.price ? Number(entity.price) : 0;

    return dto;
  }
}
