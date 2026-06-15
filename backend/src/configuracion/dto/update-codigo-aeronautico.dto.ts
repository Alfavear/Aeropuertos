import { IsString, IsInt, IsOptional, MaxLength, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCodigoAeronauticoDto {
  @ApiPropertyOptional({ description: 'Código OACI o IATA', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  codigo?: string;

  @ApiPropertyOptional({ description: 'Descripción del código', maxLength: 150 })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  descripcion?: string;

  @ApiPropertyOptional({ description: 'Tipo: 1=OACI aerolínea, 2=IATA aerolínea, 3=OACI aeropuerto, 4=IATA aeropuerto' })
  @IsOptional()
  @IsInt()
  @Min(1)
  tipo?: number;
}
