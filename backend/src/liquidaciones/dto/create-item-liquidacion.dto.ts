import { IsString, IsInt, IsOptional, IsNumber, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateItemLiquidacionDto {
  @ApiProperty({ required: false, description: 'ID de la liquidación' })
  @IsOptional()
  @IsInt()
  idLiquidacion?: number;

  @ApiProperty({ required: false, description: 'Código del item', maxLength: 25 })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  codigo?: string;

  @ApiProperty({ required: false, description: 'ID de la aeronave' })
  @IsOptional()
  @IsInt()
  idAeronave?: number;

  @ApiProperty({ required: false, description: 'Matrícula de la aeronave', maxLength: 25 })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  matricula?: string;

  @ApiProperty({ required: false, description: 'Número de vuelo', maxLength: 25 })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  vuelo?: string;

  @ApiProperty({ required: false, description: 'ID del aeropuerto destino nacional' })
  @IsOptional()
  @IsInt()
  idAeropuertoDestNac?: number;

  @ApiProperty({ required: false, description: 'ID del aeropuerto destino internacional' })
  @IsOptional()
  @IsInt()
  idAeropuertoDestInt?: number;

  @ApiProperty({ required: false, description: 'Total embarque nacional' })
  @IsOptional()
  @IsNumber()
  totalEmbNac?: number;

  @ApiProperty({ required: false, description: 'Pasajeros en tránsito nacional' })
  @IsOptional()
  @IsNumber()
  transitoNacional?: number;

  @ApiProperty({ required: false, description: 'Pasajeros exentos nacional' })
  @IsOptional()
  @IsNumber()
  exentosNacional?: number;

  @ApiProperty({ required: false, description: 'Total pagan tasa nacional' })
  @IsOptional()
  @IsNumber()
  totalPaganTasaNac?: number;

  @ApiProperty({ required: false, description: 'Pasajeros dólares internacional' })
  @IsOptional()
  @IsNumber()
  pasajerosDolaresInt?: number;

  @ApiProperty({ required: false, description: 'Pasajeros pesos internacional' })
  @IsOptional()
  @IsNumber()
  pasajerosPesosInt?: number;

  @ApiProperty({ required: false, description: 'Total pasajeros internacional' })
  @IsOptional()
  @IsNumber()
  totalPasajerosInt?: number;

  @ApiProperty({ required: false, description: 'Exentos internacional' })
  @IsOptional()
  @IsNumber()
  exentosInternacional?: number;

  @ApiProperty({ required: false, description: 'Tránsito internacional' })
  @IsOptional()
  @IsNumber()
  transitoInternacional?: number;

  @ApiProperty({ required: false, description: 'Total embarque internacional' })
  @IsOptional()
  @IsNumber()
  totalEmbInt?: number;

  @ApiProperty({ required: false, description: 'Total pasajeros' })
  @IsOptional()
  @IsNumber()
  totalPasajeros?: number;

  @ApiProperty({ required: false, description: 'Tasa nacional contado' })
  @IsOptional()
  @IsNumber()
  tasaNacContado?: number;

  @ApiProperty({ required: false, description: 'Pasajeros pesos internacional contado' })
  @IsOptional()
  @IsNumber()
  pasajerosPesosIntCont?: number;

  @ApiProperty({ required: false, description: 'Pasajeros dólares internacional contado' })
  @IsOptional()
  @IsNumber()
  pasajerosDolaresIntCont?: number;
}
