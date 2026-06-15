import { IsString, IsOptional, IsInt, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateReporteDto {
  @ApiPropertyOptional({ description: 'Código único del reporte', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  codigo?: string;

  @ApiPropertyOptional({ description: 'Nombre del reporte', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  nombre?: string;

  @ApiPropertyOptional({ description: 'Descripción del reporte', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string;

  @ApiPropertyOptional({ description: 'ID de la categoría' })
  @IsOptional()
  @IsInt()
  idCategoria?: number;

  @ApiPropertyOptional({ description: 'Ruta del reporte', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  ruta?: string;
}
