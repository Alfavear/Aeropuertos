import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAerolineaConceptoDto {
  @ApiProperty({ description: 'ID del concepto' })
  @IsInt()
  idConcepto: number;

  @ApiProperty({ description: 'ID de la aerolínea' })
  @IsInt()
  idAerolinea: number;
}
