import { PartialType } from '@nestjs/swagger';
import { CreatePasajeroNacionalDto } from './create-pasajero-nacional.dto';

export class UpdatePasajeroNacionalDto extends PartialType(CreatePasajeroNacionalDto) {}
