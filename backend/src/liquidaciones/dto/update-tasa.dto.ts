import { PartialType } from '@nestjs/swagger';
import { CreateTasaDto } from './create-tasa.dto';

export class UpdateTasaDto extends PartialType(CreateTasaDto) {}
