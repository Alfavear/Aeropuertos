import { IsInt, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAerolineaConceptoDto {
  @ApiPropertyOptional({ description: 'ID del concepto' })
  @IsOptional()
  @IsInt()
  idConcepto?: number;

  @ApiPropertyOptional({ description: 'ID de la aerolínea' })
  @IsOptional()
  @IsInt()
  idAerolinea?: number;
}
