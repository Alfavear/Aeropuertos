import { PartialType } from '@nestjs/swagger';
import { CreateRegistroPesoDto } from './create-registro-peso.dto';

export class UpdateRegistroPesoDto extends PartialType(CreateRegistroPesoDto) {}
