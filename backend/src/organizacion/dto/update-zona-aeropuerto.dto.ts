import { IsString, IsInt, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateZonaAeropuertoDto {
  @ApiPropertyOptional({ description: 'ID del aeropuerto' })
  @IsOptional()
  @IsInt()
  idAeropuerto?: number;

  @ApiPropertyOptional({ description: 'Código de la zona del aeropuerto', maxLength: 25 })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  codigo?: string;

  @ApiPropertyOptional({ description: 'Nombre de la zona del aeropuerto', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre?: string;
}
