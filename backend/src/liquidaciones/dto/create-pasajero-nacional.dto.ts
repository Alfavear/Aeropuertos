import { IsString, IsInt, IsOptional, IsDateString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePasajeroNacionalDto {
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

  @ApiProperty({ description: 'ID del aeropuerto destino' })
  @IsInt()
  idAeropuertoDestino: number;

  @ApiProperty({ description: 'Total de pasajeros' })
  @IsInt()
  totalPasajero: number;

  @ApiProperty({ description: 'ID de la aerolínea' })
  @IsInt()
  idAerolinea: number;

  @ApiProperty({ description: 'Fecha del registro' })
  @IsDateString()
  fecha: string;

  @ApiProperty({ description: 'ID del tipo de pasajero' })
  @IsInt()
  idTipoPasajero: number;

  @ApiProperty({ required: false, description: 'ID de la clase de pasajero' })
  @IsOptional()
  @IsInt()
  idClasePasajero?: number;
}
