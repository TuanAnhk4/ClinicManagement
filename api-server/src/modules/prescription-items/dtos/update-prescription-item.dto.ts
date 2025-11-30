import { PartialType } from '@nestjs/mapped-types';
import { PrescriptionItemDto } from './prescription-item.dto';

export class UpdatePrescriptionItemDto extends PartialType(PrescriptionItemDto) {}
