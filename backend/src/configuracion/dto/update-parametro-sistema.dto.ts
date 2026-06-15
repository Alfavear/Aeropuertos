import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateParametroSistemaDto {
  @ApiPropertyOptional({ description: 'Código único del parámetro', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  codigo?: string;

  @ApiPropertyOptional({ description: 'Nombre del parámetro', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre?: string;

  @ApiPropertyOptional({ description: 'Descripción del parámetro', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string;

  @ApiPropertyOptional({ description: 'Valor del parámetro', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  valor?: string;

  @ApiPropertyOptional({ description: 'Tipo de dato del valor', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  tipo?: string;

  @ApiPropertyOptional({ description: 'Módulo al que pertenece', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  modulo?: string;
}
