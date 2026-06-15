import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFolioDetalleDto {
  @ApiProperty({ description: 'ID del folio' })
  @IsInt()
  idFolio: number;

  @ApiProperty({ description: 'ID de la liquidación' })
  @IsInt()
  idLiquidacion: number;
}
