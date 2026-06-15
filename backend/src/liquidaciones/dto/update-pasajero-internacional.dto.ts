import { PartialType } from '@nestjs/swagger';
import { CreatePasajeroInternacionalDto } from './create-pasajero-internacional.dto';

export class UpdatePasajeroInternacionalDto extends PartialType(CreatePasajeroInternacionalDto) {}
