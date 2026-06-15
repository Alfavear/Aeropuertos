import { IsString, IsInt, IsOptional, IsBoolean, IsNumber, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMovimientoFacturacionDto {
  @ApiProperty({ description: 'Tipo de movimiento', maxLength: 20 })
  @IsString()
  @MaxLength(20)
  tipo: string;

  @ApiPropertyOptional({ description: 'ID de la operación' })
  @IsOptional()
  @IsInt()
  idOperacion?: number;

  @ApiPropertyOptional({ description: 'ID del concepto' })
  @IsOptional()
  @IsInt()
  idConcepto?: number;

  @ApiPropertyOptional({ description: 'ID de la aerolínea' })
  @IsOptional()
  @IsInt()
  idAerolinea?: number;

  @ApiPropertyOptional({ description: 'ID del aeropuerto' })
  @IsOptional()
  @IsInt()
  idAeropuerto?: number;

  @ApiPropertyOptional({ description: 'ID del hangar' })
  @IsOptional()
  @IsInt()
  idHangar?: number;

  @ApiPropertyOptional({ description: 'ID de la puerta' })
  @IsOptional()
  @IsInt()
  idPuerta?: number;

  @ApiPropertyOptional({ description: 'ID del servicio' })
  @IsOptional()
  @IsInt()
  idServicio?: number;

  @ApiPropertyOptional({ description: 'ID de la tasa' })
  @IsOptional()
  @IsInt()
  idTasa?: number;

  @ApiPropertyOptional({ description: 'ID del pasajero' })
  @IsOptional()
  @IsInt()
  idPasajero?: number;

  @ApiPropertyOptional({ description: 'Hora inicial' })
  @IsOptional()
  @IsString()
  horaIni?: string;

  @ApiPropertyOptional({ description: 'Hora final' })
  @IsOptional()
  @IsString()
  horaFin?: string;

  @ApiPropertyOptional({ description: 'Peso' })
  @IsOptional()
  @IsNumber()
  peso?: number;

  @ApiPropertyOptional({ description: 'Tarifa' })
  @IsOptional()
  @IsNumber()
  tarifa?: number;

  @ApiPropertyOptional({ description: 'Cantidad' })
  @IsOptional()
  @IsInt()
  cantidad?: number;

  @ApiPropertyOptional({ description: 'Valor' })
  @IsOptional()
  @IsNumber()
  valor?: number;

  @ApiPropertyOptional({ description: 'Facturado', default: false })
  @IsOptional()
  @IsBoolean()
  facturado?: boolean;

  @ApiPropertyOptional({ description: 'ID de la factura' })
  @IsOptional()
  @IsInt()
  idFactura?: number;

  @ApiPropertyOptional({ description: 'Fecha del movimiento' })
  @IsOptional()
  @IsString()
  fecha?: string;
}
