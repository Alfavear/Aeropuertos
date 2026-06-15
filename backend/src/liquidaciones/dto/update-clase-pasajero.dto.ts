import { PartialType } from '@nestjs/swagger';
import { CreateClasePasajeroDto } from './create-clase-pasajero.dto';

export class UpdateClasePasajeroDto extends PartialType(CreateClasePasajeroDto) {}
