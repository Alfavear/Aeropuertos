import { IsString, IsInt, IsOptional, IsNumber, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFacturaDetalleDto {
  @ApiPropertyOptional({ description: 'ID de la factura' })
  @IsOptional()
  @IsInt()
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

  @ApiPropertyOptional({ description: 'ID del concepto' })
  @IsOptional()
  @IsInt()
  idConcepto?: number;

  @ApiPropertyOptional({ description: 'ID del tipo de operación' })
  @IsOptional()
  @IsInt()
  idTipoOper?: number;

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

  @ApiPropertyOptional({ description: 'Cantidad' })
  @IsOptional()
  @IsInt()
  cantidad?: number;

  @ApiPropertyOptional({ description: 'Valor del concepto' })
  @IsOptional()
  @IsNumber()
  valorConcepto?: number;

  @ApiPropertyOptional({ description: 'IVA' })
  @IsOptional()
  @IsNumber()
  iva?: number;

  @ApiPropertyOptional({ description: 'Retención' })
  @IsOptional()
  @IsNumber()
  rete?: number;

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

  @ApiPropertyOptional({ description: 'Descripción del concepto', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  descConcepto?: string;
}
