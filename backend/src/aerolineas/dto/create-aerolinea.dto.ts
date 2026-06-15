import { IsString, IsInt, IsOptional, IsBoolean, IsNumber, MaxLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAerolineaDto {
  @ApiProperty({ description: 'Código único de la aerolínea', maxLength: 25 })
  @IsString()
  @MaxLength(25)
  codigo: string;

  @ApiPropertyOptional({ description: 'Nombre de la aerolínea', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre?: string;

  @ApiProperty({ description: 'NIT de la aerolínea', maxLength: 20 })
  @IsString()
  @MaxLength(20)
  nit: string;

  @ApiPropertyOptional({ description: 'Dirección', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  direccion?: string;

  @ApiPropertyOptional({ description: 'Teléfono', maxLength: 20 })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;

  @ApiPropertyOptional({ description: 'Fax', maxLength: 20 })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  fax?: string;

  @ApiPropertyOptional({ description: 'ID de la ciudad' })
  @IsOptional()
  @IsInt()
  idCiudad?: number;

  @ApiPropertyOptional({ description: 'ID del país' })
  @IsOptional()
  @IsInt()
  idPais?: number;

  @ApiProperty({ description: 'Es nacional', default: true })
  @IsBoolean()
  nacional: boolean;

  @ApiProperty({ description: 'Porcentaje de recargo nocturno' })
  @IsNumber()
  porRecargoNocturno: number;

  @ApiProperty({ description: 'Horas de gracia para parqueo' })
  @IsNumber()
  horasGraciaParqueo: number;

  @ApiProperty({ description: 'Horas de gracia para hangar' })
  @IsNumber()
  horasGraciaHangar: number;

  @ApiProperty({ description: 'Días de vencimiento de facturas', default: 30 })
  @IsInt()
  @Min(1)
  diasVctoFacturas: number;

  @ApiProperty({ description: 'Centro de costo', maxLength: 16 })
  @IsString()
  @MaxLength(16)
  centroCosto: string;

  @ApiProperty({ description: 'Auxiliar abierto', maxLength: 16 })
  @IsString()
  @MaxLength(16)
  auxiliarAbierto: string;

  @ApiProperty({ description: 'Cliente', maxLength: 16 })
  @IsString()
  @MaxLength(16)
  cliente: string;

  @ApiPropertyOptional({ description: 'Cuenta de anticipo', maxLength: 16 })
  @IsOptional()
  @IsString()
  @MaxLength(16)
  ctaAnticipo?: string;

  @ApiProperty({ description: 'Es charter', default: false })
  @IsBoolean()
  esCharter: boolean;

  @ApiPropertyOptional({ description: 'Tipo de aviación (ID de ClaseAviacion)' })
  @IsOptional()
  @IsInt()
  tipoAviacion?: number;

  @ApiPropertyOptional({ description: 'Código OACI', maxLength: 10 })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  codigoOACI?: string;

  @ApiPropertyOptional({ description: 'Código IATA', maxLength: 10 })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  codigoIATA?: string;

  @ApiProperty({ description: 'Factura tasas', default: 0 })
  @IsInt()
  factTasas: number;

  @ApiProperty({ description: 'Está activa', default: true })
  @IsBoolean()
  activo: boolean;
}
