import { PartialType } from '@nestjs/swagger';
import { CreateServicioOperacionDto } from './create-servicio-operacion.dto';

export class UpdateServicioOperacionDto extends PartialType(CreateServicioOperacionDto) {}
