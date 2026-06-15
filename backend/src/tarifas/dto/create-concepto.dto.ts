import { IsString, IsInt, IsOptional, IsBoolean, IsNumber, Min, Max, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConceptoDto {
  @ApiProperty({ description: 'Código único del concepto', maxLength: 25 })
  @IsString()
  @MaxLength(25)
  codigo: string;

  @ApiProperty({ description: 'Nombre del concepto', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ required: false, description: 'Descripción breve', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  descripcion?: string;

  @ApiProperty({ description: 'Tipo de tarifa: 0=Unitario, 1=Peso, 2=Por operación, 3=Por hora', minimum: 0, maximum: 3 })
  @IsInt()
  @Min(0)
  @Max(3)
  tipoTarifa: number;

  @ApiProperty({ required: false, default: true, description: 'Indica si el concepto está activo' })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @ApiProperty({ required: false, description: 'ID del grupo de concepto al que pertenece' })
  @IsOptional()
  @IsInt()
  idGrupoConcepto?: number;

  @ApiProperty({ required: false, default: false, description: 'Aplica impuesto al concepto' })
  @IsOptional()
  @IsBoolean()
  aplicaImpuesto?: boolean;

  @ApiProperty({ required: false, description: 'Porcentaje de impuesto nacional' })
  @IsOptional()
  @IsNumber()
  porcentImpuestoNal?: number;

  @ApiProperty({ required: false, description: 'Porcentaje de impuesto internacional' })
  @IsOptional()
  @IsNumber()
  porcentImpuestoInt?: number;

  @ApiProperty({ required: false, description: 'Valor unitario del concepto' })
  @IsOptional()
  @IsNumber()
  valorUnitario?: number;

  @ApiProperty({ required: false, description: 'Valor fijo por período' })
  @IsOptional()
  @IsNumber()
  valorFijoPeriodo?: number;

  @ApiProperty({ required: false, description: 'Modo de presentación en factura (S=Servicio, P=Producto, C=Cargo)' })
  @IsOptional()
  @IsString()
  @MaxLength(1)
  modoPresentFactura?: string;

  @ApiProperty({ required: false, description: 'Abreviatura nacional', maxLength: 25 })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  abrevNac?: string;

  @ApiProperty({ required: false, description: 'Abreviatura internacional', maxLength: 25 })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  abrevInt?: string;

  @ApiProperty({ required: false, description: 'Tipo de reporte asociado' })
  @IsOptional()
  @IsInt()
  tipoReporte?: number;
}
