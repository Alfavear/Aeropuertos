import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateServicioAereoDto {
  @ApiPropertyOptional({ description: 'Código único del servicio', maxLength: 25 })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  codigo?: string;

  @ApiPropertyOptional({ description: 'Nombre del servicio', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre?: string;

  @ApiPropertyOptional({ description: 'Descripción del servicio', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  descripcion?: string;
}
