import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateImpuestoDto } from './create-impuesto.dto';

export class UpdateImpuestoDto extends PartialType(
  OmitType(CreateImpuestoDto, ['codigo'] as const),
) {}
