import { IsString, IsInt, IsOptional, IsNumber, IsDateString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePasajeroInternacionalDto {
  @ApiProperty({ description: 'ID de la liquidación' })
  @IsInt()
  idLiquidacion: number;

  @ApiProperty({ description: 'Matrícula de la aeronave', maxLength: 12 })
  @IsString()
  @MaxLength(12)
  matricula: string;

  @ApiProperty({ description: 'Número de vuelo', maxLength: 4 })
  @IsString()
  @MaxLength(4)
  vuelo: string;

  @ApiProperty({ required: false, description: 'ID del aeropuerto destino' })
  @IsOptional()
  @IsInt()
  idAeropuertoDestino?: number;

  @ApiProperty({ description: 'Total de pasajeros' })
  @IsInt()
  totalPasajero: number;

  @ApiProperty({ required: false, description: 'ID de la aerolínea' })
  @IsOptional()
  @IsInt()
  idAerolinea?: number;

  @ApiProperty({ description: 'Fecha del registro' })
  @IsDateString()
  fecha: string;

  @ApiProperty({ description: 'Pasajeros que pagan en dólares' })
  @IsNumber()
  pasajDolares: number;

  @ApiProperty({ description: 'Pasajeros que pagan en pesos' })
  @IsNumber()
  pasajPesos: number;
}
