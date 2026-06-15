import { IsString, IsNumber, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFacturaImpuestoDto {
  @ApiProperty({ description: 'ID de la factura' })
  @IsNumber()
  idFactura: number;

  @ApiProperty({ description: 'Código del impuesto', maxLength: 25 })
  @IsString()
  @MaxLength(25)
  codigoImpuesto: string;

  @ApiProperty({ description: 'Base del impuesto' })
  @IsNumber()
  base: number;

  @ApiProperty({ description: 'Valor del impuesto' })
  @IsNumber()
  valor: number;

  @ApiProperty({ description: 'Porcentaje del impuesto' })
  @IsNumber()
  porcentaje: number;
}
