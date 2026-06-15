import { IsString, IsOptional, IsNumber, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFacturaPagoDto {
  @ApiPropertyOptional({ description: 'ID de la factura' })
  @IsOptional()
  @IsNumber()
  idFactura?: number;

  @ApiPropertyOptional({ description: 'Fuente', maxLength: 2 })
  @IsOptional()
  @IsString()
  @MaxLength(2)
  fuente?: string;

  @ApiPropertyOptional({ description: 'Documento', maxLength: 10 })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  documento?: string;

  @ApiPropertyOptional({ description: 'Tipo de pago', maxLength: 5 })
  @IsOptional()
  @IsString()
  @MaxLength(5)
  tipoPago?: string;

  @ApiPropertyOptional({ description: 'Cuenta contable', maxLength: 16 })
  @IsOptional()
  @IsString()
  @MaxLength(16)
  cuenta?: string;

  @ApiPropertyOptional({ description: 'Descripción', maxLength: 1000 })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  descripcion?: string;

  @ApiPropertyOptional({ description: 'Tercero', maxLength: 25 })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  tercero?: string;

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

  @ApiPropertyOptional({ description: 'Business Unit', maxLength: 25 })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  bu?: string;
}
