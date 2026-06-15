import { IsString, IsInt, IsOptional, IsBoolean, IsNumber, MaxLength, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAeropuertoDto {
  @ApiPropertyOptional({ description: 'Código único del aeropuerto', maxLength: 25 })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  codigo?: string;

  @ApiPropertyOptional({ description: 'Nombre del aeropuerto', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre?: string;

  @ApiPropertyOptional({ description: 'ID de la ciudad donde se ubica' })
  @IsOptional()
  @IsInt()
  idCiudad?: number;

  @ApiPropertyOptional({ description: 'ID de la zona geográfica' })
  @IsOptional()
  @IsInt()
  idZona?: number;

  @ApiPropertyOptional({ description: 'ID del país' })
  @IsOptional()
  @IsInt()
  idPais?: number;

  @ApiPropertyOptional({ description: 'Tasa aeroportuaria' })
  @IsOptional()
  @IsNumber()
  tasa?: number;

  @ApiPropertyOptional({ description: 'Maneja carga' })
  @IsOptional()
  @IsBoolean()
  manejoCarga?: boolean;

  @ApiPropertyOptional({ description: 'Control administrativo' })
  @IsOptional()
  @IsBoolean()
  controlAdministrativo?: boolean;

  @ApiPropertyOptional({ description: 'Número de hangares', default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  numeroHangares?: number;

  @ApiPropertyOptional({ description: 'Unidad de negocio', maxLength: 25 })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  bu?: string;

  @ApiPropertyOptional({ description: 'Hora inicial de operación', maxLength: 10 })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  horaI?: string;

  @ApiPropertyOptional({ description: 'Hora final de operación', maxLength: 10 })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  horaF?: string;

  @ApiPropertyOptional({ description: 'Dirección del aeropuerto', maxLength: 150 })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  dirAeropuerto?: string;

  @ApiPropertyOptional({ description: 'Representante de aeronáutica civil', maxLength: 150 })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  repreAeroCivil?: string;

  @ApiPropertyOptional({ description: 'Día de cierre contable' })
  @IsOptional()
  @IsInt()
  cerrarDia?: number;

  @ApiPropertyOptional({ description: 'Hora de cierre', maxLength: 4 })
  @IsOptional()
  @IsString()
  @MaxLength(4)
  horaCierre?: string;
}
