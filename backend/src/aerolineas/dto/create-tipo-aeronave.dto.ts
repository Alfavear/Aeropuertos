import { IsString, IsInt, IsOptional, IsNumber, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTipoAeronaveDto {
  @ApiProperty({ description: 'Código del tipo de aeronave', maxLength: 25 })
  @IsString()
  @MaxLength(25)
  codigo: string;

  @ApiPropertyOptional({ description: 'Descripción', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  descripcion?: string;

  @ApiPropertyOptional({ description: 'ID del fabricante' })
  @IsOptional()
  @IsInt()
  idFabricante?: number;

  @ApiPropertyOptional({ description: 'Modelo', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  modelo?: string;

  @ApiPropertyOptional({ description: 'Capacidad de pasajeros' })
  @IsOptional()
  @IsInt()
  capacidadPasajeros?: number;

  @ApiPropertyOptional({ description: 'Total de tripulación' })
  @IsOptional()
  @IsInt()
  totalTripulacion?: number;

  @ApiPropertyOptional({ description: 'Peso' })
  @IsOptional()
  @IsNumber()
  peso?: number;
}
