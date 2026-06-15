import { IsInt, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFolioDetalleDto {
  @ApiPropertyOptional({ description: 'ID del folio' })
  @IsOptional()
  @IsInt()
  idFolio?: number;

  @ApiPropertyOptional({ description: 'ID de la liquidación' })
  @IsOptional()
  @IsInt()
  idLiquidacion?: number;
}
