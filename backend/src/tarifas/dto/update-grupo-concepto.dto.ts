import { PartialType } from '@nestjs/swagger';
import { CreateGrupoConceptoDto } from './create-grupo-concepto.dto';

export class UpdateGrupoConceptoDto extends PartialType(CreateGrupoConceptoDto) {}
