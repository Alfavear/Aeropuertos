import { PartialType } from '@nestjs/swagger';
import { CreateTipoOperacionDto } from './create-tipo-operacion.dto';

export class UpdateTipoOperacionDto extends PartialType(CreateTipoOperacionDto) {}
