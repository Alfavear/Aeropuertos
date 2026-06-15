import { IsString, IsOptional, IsInt, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePersonalAerolineaDto {
  @ApiPropertyOptional({ description: 'Identificación del personal', maxLength: 25 })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  identificacion?: string;

  @ApiPropertyOptional({ description: 'Nombre del personal', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre?: string;

  @ApiPropertyOptional({ description: 'ID de la aerolínea' })
  @IsOptional()
  @IsInt()
  idAerolinea?: number;

  @ApiPropertyOptional({ description: 'Cargo', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  cargo?: string;
}
