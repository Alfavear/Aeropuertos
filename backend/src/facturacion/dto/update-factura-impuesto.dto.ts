import { IsString, IsOptional, IsNumber, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFacturaImpuestoDto {
  @ApiPropertyOptional({ description: 'ID de la factura' })
  @IsOptional()
  @IsNumber()
  idFactura?: number;

  @ApiPropertyOptional({ description: 'Código del impuesto', maxLength: 25 })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  codigoImpuesto?: string;

  @ApiPropertyOptional({ description: 'Base del impuesto' })
  @IsOptional()
  @IsNumber()
  base?: number;

  @ApiPropertyOptional({ description: 'Valor del impuesto' })
  @IsOptional()
  @IsNumber()
  valor?: number;

  @ApiPropertyOptional({ description: 'Porcentaje del impuesto' })
  @IsOptional()
  @IsNumber()
  porcentaje?: number;
}
