import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateConceptoDto } from './create-concepto.dto';

export class UpdateConceptoDto extends PartialType(
  OmitType(CreateConceptoDto, ['tipoTarifa'] as const),
) {}
