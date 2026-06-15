import { PartialType } from '@nestjs/swagger';
import { CreateNotaOperacionDto } from './create-nota-operacion.dto';

export class UpdateNotaOperacionDto extends PartialType(CreateNotaOperacionDto) {}
