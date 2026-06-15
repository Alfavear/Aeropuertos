import { PartialType } from '@nestjs/swagger';
import { CreatePuertaEmbarqueDto } from './create-puerta-embarque.dto';

export class UpdatePuertaEmbarqueDto extends PartialType(CreatePuertaEmbarqueDto) {}
