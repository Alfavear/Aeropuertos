import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePerfilDto {
  @ApiPropertyOptional({ description: 'Código único del perfil', maxLength: 25 })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  codigo?: string;

  @ApiPropertyOptional({ description: 'Nombre del perfil', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre?: string;

  @ApiPropertyOptional({ description: 'Descripción del perfil', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  descripcion?: string;

  @ApiPropertyOptional({ description: 'Perfil activo' })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
