import { Specialty } from '../entities';

export class SpecialtyResponseDto {
  id: number;
  name: string;
  description: string;
  baseCost: number;

  static fromEntity(entity: Specialty): SpecialtyResponseDto {
    const dto = new SpecialtyResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.description = entity.description || '';

    dto.baseCost = entity.base_cost ? Number(entity.base_cost) : 0;

    return dto;
  }
}
