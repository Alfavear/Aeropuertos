import { IsString, IsInt, IsOptional, IsBoolean, IsDateString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateItinerarioDto {
  @ApiProperty({ description: 'Código del aeropuerto', maxLength: 25 })
  @IsString()
  @MaxLength(25)
  codAeropuerto: string;

  @ApiProperty({ description: 'Código de la aerolínea', maxLength: 25 })
  @IsString()
  @MaxLength(25)
  codAerolinea: string;

  @ApiProperty({ required: false, description: 'ID del vuelo asociado' })
  @IsOptional()
  @IsInt()
  idVuelo?: number;

  @ApiProperty({ description: 'Número de vuelo', maxLength: 25 })
  @IsString()
  @MaxLength(25)
  numeroVuelo: string;

  @ApiProperty({ description: 'Hora del vuelo (ISO date)' })
  @IsDateString()
  horaVuelo: string;

  @ApiProperty({ description: 'Tipo de operación (LLEGADA/SALIDA)', maxLength: 10 })
  @IsString()
  @MaxLength(10)
  operacion: string;

  @ApiProperty({ required: false, description: 'Matrícula de la aeronave', maxLength: 25 })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  matricula?: string;

  @ApiProperty({ description: 'Aeropuerto de destino', maxLength: 25 })
  @IsString()
  @MaxLength(25)
  aeropuertoDest: string;

  @ApiProperty({ required: false, default: false, description: 'Indica si el itinerario fue ejecutado' })
  @IsOptional()
  @IsBoolean()
  ejecutado?: boolean;

  @ApiProperty({ required: false, description: 'Estado del itinerario', maxLength: 15 })
  @IsOptional()
  @IsString()
  @MaxLength(15)
  estado?: string;

  @ApiProperty({ required: false, description: 'Observaciones', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  observacion?: string;

  @ApiProperty({ required: false, description: 'Tipo de aeronave', maxLength: 25 })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  tipoAeronave?: string;
}
