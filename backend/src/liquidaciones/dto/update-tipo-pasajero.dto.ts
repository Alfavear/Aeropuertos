import { PartialType } from '@nestjs/swagger';
import { CreateTipoPasajeroDto } from './create-tipo-pasajero.dto';

export class UpdateTipoPasajeroDto extends PartialType(CreateTipoPasajeroDto) {}
