import { IsString, IsInt, IsOptional, IsNumber, IsDateString, IsArray, Min, Max, ArrayNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CalcularConceptosDto {
  @ApiProperty({ description: 'ID de la aerolínea' })
  @IsInt()
  idAerolinea: number;

  @ApiProperty({ description: 'ID del aeropuerto' })
  @IsInt()
  idAeropuerto: number;

  @ApiProperty({ description: 'Fecha de la operación (ISO date)' })
  @IsDateString()
  fecha: string;

  @ApiProperty({ description: 'Nacionalidad: N=local, I=internacional', enum: ['N', 'I'] })
  @IsString()
  nacionalidad: 'N' | 'I';

  @ApiPropertyOptional({ description: 'Peso de la aeronave en kg' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  peso?: number;

  @ApiPropertyOptional({ description: 'Moneda de pago: 0=COP, 1=USD' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1)
  monedaPago?: number;

  @ApiPropertyOptional({ description: 'Hora de llegada/aterrizaje (ISO date)' })
  @IsOptional()
  @IsDateString()
  horaLlegada?: string;

  @ApiPropertyOptional({ description: 'Hora de salida/despegue (ISO date)' })
  @IsOptional()
  @IsDateString()
  horaSalida?: string;

  @ApiPropertyOptional({ description: 'Total de pasajeros que pagan tasa' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalPaganTasa?: number;

  @ApiPropertyOptional({ description: 'Pasajeros internacionales que pagan en pesos' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pasajerosPesos?: number;

  @ApiPropertyOptional({ description: 'Pasajeros internacionales que pagan en dólares' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pasajerosDolares?: number;

  @ApiPropertyOptional({ description: 'Cantidad de unidades (ej. pasajeros, horas)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cantidad?: number;

  @ApiProperty({ description: 'Conceptos a calcular', example: ['ATERRIZAJE', 'PARQUEO', 'TASA'] })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  conceptos: string[];
}
