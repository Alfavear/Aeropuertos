import { IsInt, IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAccesoAeropuertoDto {
  @ApiPropertyOptional({ description: 'Acceso activo' })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @ApiPropertyOptional({ description: 'Puede cambiar aeropuerto de trabajo' })
  @IsOptional()
  @IsBoolean()
  cambiarAeropuerto?: boolean;

  @ApiPropertyOptional({ description: 'Puede cambiar fecha de facturación' })
  @IsOptional()
  @IsBoolean()
  cambiarFechaFact?: boolean;

  @ApiPropertyOptional({ description: 'Puede cambiar fuente' })
  @IsOptional()
  @IsBoolean()
  cambiarFuente?: boolean;

  @ApiPropertyOptional({ description: 'Puede cambiar serie' })
  @IsOptional()
  @IsBoolean()
  cambiarSerie?: boolean;

  @ApiPropertyOptional({ description: 'Es administrador de periodos' })
  @IsOptional()
  @IsBoolean()
  administradorPeriodos?: boolean;

  @ApiPropertyOptional({ description: 'Puede cambiar estado incluso facturado' })
  @IsOptional()
  @IsBoolean()
  cambiarEstadoInclusoFacturado?: boolean;

  @ApiPropertyOptional({ description: 'Controla tasas' })
  @IsOptional()
  @IsBoolean()
  controlaTasas?: boolean;

  @ApiPropertyOptional({ description: 'ID de puerta que controla' })
  @IsOptional()
  @IsInt()
  idPuertaControla?: number;

  @ApiPropertyOptional({ description: 'Puede permitir reversiones' })
  @IsOptional()
  @IsBoolean()
  permitirReversiones?: boolean;

  @ApiPropertyOptional({ description: 'Reversiones solo POS' })
  @IsOptional()
  @IsBoolean()
  revertirSoloPOS?: boolean;

  @ApiPropertyOptional({ description: 'Habilita operaciones intermedias' })
  @IsOptional()
  @IsBoolean()
  habilOperInter?: boolean;

  @ApiPropertyOptional({ description: 'Usa fuente/serie de contado propia' })
  @IsOptional()
  @IsBoolean()
  usaFuenteContado?: boolean;

  @ApiPropertyOptional({ description: 'Fuente contado' })
  @IsOptional()
  @IsString()
  @MaxLength(2)
  fuenteContado?: string;

  @ApiPropertyOptional({ description: 'Serie contado' })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  serieContado?: string;

  @ApiPropertyOptional({ description: 'Usa fuente/serie de crédito propia' })
  @IsOptional()
  @IsBoolean()
  usaFuenteCredito?: boolean;

  @ApiPropertyOptional({ description: 'Fuente crédito' })
  @IsOptional()
  @IsString()
  @MaxLength(2)
  fuenteCredito?: string;

  @ApiPropertyOptional({ description: 'Serie crédito' })
  @IsOptional()
  @IsString()
  @MaxLength(2)
  serieCredito?: string;

  @ApiPropertyOptional({ description: 'Usa fuente/serie de nota débito propia' })
  @IsOptional()
  @IsBoolean()
  usaFuenteNotasDB?: boolean;

  @ApiPropertyOptional({ description: 'Fuente nota débito' })
  @IsOptional()
  @IsString()
  @MaxLength(2)
  fuenteNotaDB?: string;

  @ApiPropertyOptional({ description: 'Serie nota débito' })
  @IsOptional()
  @IsString()
  @MaxLength(2)
  serieNotaDB?: string;

  @ApiPropertyOptional({ description: 'Usa fuente/serie de nota crédito propia' })
  @IsOptional()
  @IsBoolean()
  usaFuenteNotasCR?: boolean;

  @ApiPropertyOptional({ description: 'Fuente nota crédito' })
  @IsOptional()
  @IsString()
  @MaxLength(2)
  fuenteNotaCR?: string;

  @ApiPropertyOptional({ description: 'Serie nota crédito' })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  serieNotaCR?: string;
}
