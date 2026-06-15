import { IsString, IsBoolean, IsOptional, IsInt, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTipoPasajeroDto {
  @ApiProperty({ description: 'Código del tipo de pasajero', maxLength: 2 })
  @IsString()
  @MaxLength(2)
  codigo: string;

  @ApiProperty({ description: 'Nombre del tipo de pasajero', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ required: false, default: false, description: 'Indica si está exento' })
  @IsOptional()
  @IsBoolean()
  exento?: boolean;

  @ApiProperty({ required: false, description: 'ID de la clase de pasajero' })
  @IsOptional()
  @IsInt()
  idClasePasajero?: number;

  @ApiProperty({ required: false, default: false, description: 'Indica si es pasajero no físico' })
  @IsOptional()
  @IsBoolean()
  paxNoFisico?: boolean;
}
