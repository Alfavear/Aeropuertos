import { IsString, IsOptional, MaxLength, IsDateString, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePeriodoDto {
  @ApiProperty({ description: 'Código único del período (ej: 2026-01)', maxLength: 25 })
  @IsString()
  @MaxLength(25)
  codigo: string;

  @ApiPropertyOptional({ description: 'Fecha de inicio del período' })
  @IsOptional()
  @IsDateString()
  fechaIni?: string;

  @ApiPropertyOptional({ description: 'Fecha de fin del período' })
  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @ApiPropertyOptional({ description: 'Estado del período (A=Abierto, C=Cerrado)', default: 'A' })
  @IsOptional()
  @IsString()
  @MaxLength(1)
  @IsIn(['A', 'C'])
  estado?: string;

  @ApiPropertyOptional({ description: 'Usuario que creó/cerró el período', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  usuario?: string;

  @ApiPropertyOptional({ description: 'Fecha de cierre del período' })
  @IsOptional()
  @IsDateString()
  fechaCierre?: string;
}
