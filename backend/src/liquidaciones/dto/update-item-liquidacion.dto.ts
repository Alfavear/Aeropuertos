import { PartialType } from '@nestjs/swagger';
import { CreateItemLiquidacionDto } from './create-item-liquidacion.dto';

export class UpdateItemLiquidacionDto extends PartialType(CreateItemLiquidacionDto) {}
