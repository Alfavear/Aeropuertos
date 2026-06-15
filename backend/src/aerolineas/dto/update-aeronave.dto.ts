import { IsString, IsInt, IsOptional, IsBoolean, IsNumber, MaxLength, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAeronaveDto {
  @ApiPropertyOptional({ description: 'Matrícula de la aeronave', maxLength: 25 })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  matricula?: string;

  @ApiPropertyOptional({ description: 'ID de la aerolínea propietaria' })
  @IsOptional()
  @IsInt()
  idAerolinea?: number;

  @ApiPropertyOptional({ description: 'ID del tipo de aeronave' })
  @IsOptional()
  @IsInt()
  idTipoAeronave?: number;

  @ApiPropertyOptional({ description: 'Peso en kilogramos' })
  @IsOptional()
  @IsNumber()
  pesoKilos?: number;

  @ApiPropertyOptional({ description: 'Peso en libras' })
  @IsOptional()
  @IsNumber()
  pesoLibras?: number;

  @ApiPropertyOptional({ description: 'Es nacional' })
  @IsOptional()
  @IsBoolean()
  nacional?: boolean;

  @ApiPropertyOptional({ description: 'Propietario', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  propietario?: string;

  @ApiPropertyOptional({ description: 'Tipo de aviación (ID de ClaseAviacion)' })
  @IsOptional()
  @IsInt()
  aviacion?: number;

  @ApiPropertyOptional({ description: 'Capacidad de pasajeros' })
  @IsOptional()
  @IsInt()
  @Min(0)
  capacidadPasajeros?: number;

  @ApiPropertyOptional({ description: 'Sub-aviación', maxLength: 25 })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  subAviacion?: string;

  @ApiPropertyOptional({ description: 'Certificado de explotación nacional' })
  @IsOptional()
  @IsBoolean()
  certExplotNac?: boolean;

  @ApiPropertyOptional({ description: 'Fecha inicio KDU/KA' })
  @IsOptional()
  @IsString()
  fechaKduKaIni?: string;

  @ApiPropertyOptional({ description: 'Fecha fin KDU/KA' })
  @IsOptional()
  @IsString()
  fechaKduKaFin?: string;

  @ApiPropertyOptional({ description: 'Fecha de recibo' })
  @IsOptional()
  @IsString()
  fechaRecibe?: string;

  @ApiPropertyOptional({ description: 'Quién recibe', maxLength: 150 })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  quienRecibe?: string;

  @ApiPropertyOptional({ description: 'Está activa' })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
