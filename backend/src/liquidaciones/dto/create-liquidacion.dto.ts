import { IsString, IsInt, IsOptional, IsDateString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLiquidacionDto {
  @ApiProperty({ description: 'Código único de la liquidación', maxLength: 25 })
  @IsString()
  @MaxLength(25)
  codigo: string;

  @ApiProperty({ required: false, description: 'ID del aeropuerto' })
  @IsOptional()
  @IsInt()
  idAeropuerto?: number;

  @ApiProperty({ required: false, description: 'Fecha de la liquidación' })
  @IsOptional()
  @IsDateString()
  fecha?: string;

  @ApiProperty({ required: false, description: 'ID de la aerolínea' })
  @IsOptional()
  @IsInt()
  idAerolinea?: number;

  @ApiProperty({ required: false, description: 'Estado de la liquidación', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  estado?: string;

  @ApiProperty({ required: false, description: 'Cargo a (usuario/responsable)' })
  @IsOptional()
  @IsInt()
  conCargoA?: number;
}
