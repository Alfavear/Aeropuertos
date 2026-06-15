import { PartialType } from '@nestjs/swagger';
import { CreateTarifaAerolineaDto } from './create-tarifa-aerolinea.dto';

export class UpdateTarifaAerolineaDto extends PartialType(CreateTarifaAerolineaDto) {}
