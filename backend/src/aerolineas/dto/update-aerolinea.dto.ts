import { IsString, IsInt, IsOptional, IsBoolean, IsNumber, MaxLength, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAerolineaDto {
  @ApiPropertyOptional({ description: 'Código único de la aerolínea', maxLength: 25 })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  codigo?: string;

  @ApiPropertyOptional({ description: 'Nombre de la aerolínea', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre?: string;

  @ApiPropertyOptional({ description: 'NIT de la aerolínea', maxLength: 20 })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  nit?: string;

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

  @ApiPropertyOptional({ description: 'Es nacional' })
  @IsOptional()
  @IsBoolean()
  nacional?: boolean;

  @ApiPropertyOptional({ description: 'Porcentaje de recargo nocturno' })
  @IsOptional()
  @IsNumber()
  porRecargoNocturno?: number;

  @ApiPropertyOptional({ description: 'Horas de gracia para parqueo' })
  @IsOptional()
  @IsNumber()
  horasGraciaParqueo?: number;

  @ApiPropertyOptional({ description: 'Horas de gracia para hangar' })
  @IsOptional()
  @IsNumber()
  horasGraciaHangar?: number;

  @ApiPropertyOptional({ description: 'Días de vencimiento de facturas' })
  @IsOptional()
  @IsInt()
  @Min(1)
  diasVctoFacturas?: number;

  @ApiPropertyOptional({ description: 'Centro de costo', maxLength: 16 })
  @IsOptional()
  @IsString()
  @MaxLength(16)
  centroCosto?: string;

  @ApiPropertyOptional({ description: 'Auxiliar abierto', maxLength: 16 })
  @IsOptional()
  @IsString()
  @MaxLength(16)
  auxiliarAbierto?: string;

  @ApiPropertyOptional({ description: 'Cliente', maxLength: 16 })
  @IsOptional()
  @IsString()
  @MaxLength(16)
  cliente?: string;

  @ApiPropertyOptional({ description: 'Cuenta de anticipo', maxLength: 16 })
  @IsOptional()
  @IsString()
  @MaxLength(16)
  ctaAnticipo?: string;

  @ApiPropertyOptional({ description: 'Es charter' })
  @IsOptional()
  @IsBoolean()
  esCharter?: boolean;

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

  @ApiPropertyOptional({ description: 'Factura tasas' })
  @IsOptional()
  @IsInt()
  factTasas?: number;

  @ApiPropertyOptional({ description: 'Está activa' })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
