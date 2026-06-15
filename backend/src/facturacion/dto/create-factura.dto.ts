import { IsString, IsInt, IsOptional, IsNumber, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFacturaDto {
  @ApiPropertyOptional({ description: 'Fuente de facturación', maxLength: 2 })
  @IsOptional()
  @IsString()
  @MaxLength(2)
  fuente?: string;

  @ApiPropertyOptional({ description: 'Número de documento', maxLength: 10 })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  documento?: string;

  @ApiPropertyOptional({ description: 'Fecha de la factura' })
  @IsOptional()
  @IsString()
  fecha?: string;

  @ApiPropertyOptional({ description: 'ID de la aerolínea' })
  @IsOptional()
  @IsInt()
  idAerolinea?: number;

  @ApiPropertyOptional({ description: 'Código del cliente', maxLength: 25 })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  cliente?: string;

  @ApiPropertyOptional({ description: 'Tercero', maxLength: 25 })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  tercero?: string;

  @ApiPropertyOptional({ description: 'Tipo de factura' })
  @IsOptional()
  @IsInt()
  tipoFactura?: number;

  @ApiPropertyOptional({ description: 'Descripción', maxLength: 1000 })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  descripcion?: string;

  @ApiPropertyOptional({ description: 'ID de la moneda' })
  @IsOptional()
  @IsInt()
  idMoneda?: number;

  @ApiPropertyOptional({ description: 'Total neto' })
  @IsOptional()
  @IsNumber()
  totalNeto?: number;

  @ApiPropertyOptional({ description: 'Total IVA' })
  @IsOptional()
  @IsNumber()
  totalIVA?: number;

  @ApiPropertyOptional({ description: 'Total retención' })
  @IsOptional()
  @IsNumber()
  totalRete?: number;

  @ApiPropertyOptional({ description: 'Total anticipo' })
  @IsOptional()
  @IsNumber()
  totalAnticipo?: number;

  @ApiPropertyOptional({ description: 'Total' })
  @IsOptional()
  @IsNumber()
  total?: number;

  @ApiPropertyOptional({ description: 'Total en moneda extranjera' })
  @IsOptional()
  @IsNumber()
  totalMoneda?: number;

  @ApiPropertyOptional({ description: 'Tasa de cambio' })
  @IsOptional()
  @IsNumber()
  tasaCambio?: number;

  @ApiPropertyOptional({ description: 'Usuario que creó la factura', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  usuario?: string;

  @ApiPropertyOptional({ description: 'Business Unit', maxLength: 25 })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  bu?: string;

  @ApiPropertyOptional({ description: 'Estado de la factura', maxLength: 2 })
  @IsOptional()
  @IsString()
  @MaxLength(2)
  estado?: string;
}
