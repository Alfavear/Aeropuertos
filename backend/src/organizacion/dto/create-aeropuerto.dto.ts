import { IsString, IsInt, IsOptional, IsBoolean, IsNumber, MaxLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAeropuertoDto {
  @ApiProperty({ description: 'Código único del aeropuerto', maxLength: 25 })
  @IsString()
  @MaxLength(25)
  codigo: string;

  @ApiProperty({ description: 'Nombre del aeropuerto', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ description: 'ID de la ciudad donde se ubica' })
  @IsInt()
  idCiudad: number;

  @ApiProperty({ description: 'ID de la zona geográfica' })
  @IsInt()
  idZona: number;

  @ApiPropertyOptional({ description: 'ID del país' })
  @IsOptional()
  @IsInt()
  idPais?: number;

  @ApiProperty({ description: 'Tasa aeroportuaria' })
  @IsNumber()
  tasa: number;

  @ApiProperty({ description: 'Maneja carga', default: false })
  @IsBoolean()
  manejoCarga: boolean;

  @ApiProperty({ description: 'Control administrativo', default: false })
  @IsBoolean()
  controlAdministrativo: boolean;

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
