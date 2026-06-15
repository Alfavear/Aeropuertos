import { PartialType } from '@nestjs/swagger';
import { CreateAsignacionPuertaVueloDto } from './create-asignacion-puerta-vuelo.dto';

export class UpdateAsignacionPuertaVueloDto extends PartialType(CreateAsignacionPuertaVueloDto) {}
