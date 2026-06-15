import { IsString, IsOptional, IsInt, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateClaseAviacionDto {
  @ApiPropertyOptional({ description: 'Código de la clase de aviación', maxLength: 25 })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  codigo?: string;

  @ApiPropertyOptional({ description: 'Descripción', maxLength: 150 })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  descripcion?: string;

  @ApiPropertyOptional({ description: 'ID de la clase superior' })
  @IsOptional()
  @IsInt()
  claseSuperior?: number;
}
