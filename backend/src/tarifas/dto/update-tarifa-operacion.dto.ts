import { PartialType } from '@nestjs/swagger';
import { CreateTarifaOperacionDto } from './create-tarifa-operacion.dto';

export class UpdateTarifaOperacionDto extends PartialType(CreateTarifaOperacionDto) {}
