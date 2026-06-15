import { IsInt, IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFolioDto {
  @ApiPropertyOptional({ description: 'ID del aeropuerto' })
  @IsOptional()
  @IsInt()
  idAeropuerto?: number;

  @ApiPropertyOptional({ description: 'ID de la aerolínea' })
  @IsOptional()
  @IsInt()
  idAerolinea?: number;

  @ApiPropertyOptional({ description: 'Fecha del folio' })
  @IsOptional()
  @IsString()
  fecha?: string;

  @ApiPropertyOptional({ description: 'Estado del folio' })
  @IsOptional()
  @IsInt()
  estado?: number;

  @ApiPropertyOptional({ description: 'Observación', maxLength: 1000 })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  observacion?: string;
}
