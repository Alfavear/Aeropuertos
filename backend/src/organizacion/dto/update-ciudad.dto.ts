import { IsString, IsInt, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCiudadDto {
  @ApiPropertyOptional({ description: 'Código de la ciudad', maxLength: 25 })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  codigo?: string;

  @ApiPropertyOptional({ description: 'Nombre de la ciudad', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre?: string;

  @ApiPropertyOptional({ description: 'ID del país al que pertenece' })
  @IsOptional()
  @IsInt()
  idPais?: number;
}
