import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ConceptoCalculadoDto {
  @ApiProperty({ description: 'ID del concepto' })
  idConcepto: number;

  @ApiProperty({ description: 'Código del concepto' })
  codigo: string;

  @ApiProperty({ description: 'Nombre del concepto' })
  nombre: string;

  @ApiProperty({ description: 'Tipo de cálculo: ATERRIZAJE | PARQUEO | TASA | SERVICIO' })
  tipo: string;

  @ApiProperty({ description: 'Valor calculado total' })
  valor: number;

  @ApiProperty({ description: 'Tarifa unitaria aplicada' })
  tarifa: number;

  @ApiProperty({ description: 'Cantidad de unidades' })
  cantidad: number;

  @ApiProperty({ description: 'Moneda del resultado: COP | USD' })
  moneda: string;

  @ApiPropertyOptional({ description: 'Traza legible de la fórmula aplicada' })
  formula?: string;
}

export class ResultadoCalculoDto {
  @ApiProperty({ description: 'Indica si el cálculo fue exitoso' })
  exito: boolean;

  @ApiProperty({ description: 'ID de la aerolínea' })
  idAerolinea: number;

  @ApiProperty({ description: 'ID del aeropuerto' })
  idAeropuerto: number;

  @ApiProperty({ description: 'Fecha de la operación' })
  fecha: string;

  @ApiProperty({ description: 'Nacionalidad' })
  nacionalidad: string;

  @ApiPropertyOptional({ description: 'Peso utilizado' })
  peso?: number;

  @ApiProperty({ description: 'Conceptos calculados' })
  conceptos: ConceptoCalculadoDto[];

  @ApiPropertyOptional({ description: 'Valor total sumarizado (COP)' })
  totalCOP?: number;

  @ApiPropertyOptional({ description: 'Valor total sumarizado (USD)' })
  totalUSD?: number;

  @ApiPropertyOptional({ description: 'Mensaje de error si falló' })
  error?: string;
}
