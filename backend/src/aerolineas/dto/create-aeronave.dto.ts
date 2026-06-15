import { IsString, IsInt, IsOptional, IsBoolean, IsNumber, MaxLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAeronaveDto {
  @ApiProperty({ description: 'Matrícula de la aeronave', maxLength: 25 })
  @IsString()
  @MaxLength(25)
  matricula: string;

  @ApiProperty({ description: 'ID de la aerolínea propietaria' })
  @IsInt()
  idAerolinea: number;

  @ApiProperty({ description: 'ID del tipo de aeronave' })
  @IsInt()
  idTipoAeronave: number;

  @ApiProperty({ description: 'Peso en kilogramos' })
  @IsNumber()
  pesoKilos: number;

  @ApiPropertyOptional({ description: 'Peso en libras' })
  @IsOptional()
  @IsNumber()
  pesoLibras?: number;

  @ApiProperty({ description: 'Es nacional', default: true })
  @IsBoolean()
  nacional: boolean;

  @ApiProperty({ description: 'Propietario', maxLength: 50 })
  @IsString()
  @MaxLength(50)
  propietario: string;

  @ApiProperty({ description: 'Tipo de aviación (ID de ClaseAviacion)' })
  @IsInt()
  aviacion: number;

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

  @ApiProperty({ description: 'Certificado de explotación nacional', default: false })
  @IsBoolean()
  certExplotNac: boolean;

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

  @ApiProperty({ description: 'Está activa', default: true })
  @IsBoolean()
  activo: boolean;
}
