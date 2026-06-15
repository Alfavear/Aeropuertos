import { PartialType } from '@nestjs/swagger';
import { CreateLiquidacionDto } from './create-liquidacion.dto';

export class UpdateLiquidacionDto extends PartialType(CreateLiquidacionDto) {}
