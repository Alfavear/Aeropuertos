import { IsInt, IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePermisoPerfilDto {
  @ApiPropertyOptional({ description: 'ID del perfil' })
  @IsOptional()
  @IsInt()
  idPerfil?: number;

  @ApiPropertyOptional({ description: 'Nombre del recurso', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  recurso?: string;

  @ApiPropertyOptional({ description: 'Nivel de permiso' })
  @IsOptional()
  @IsInt()
  permiso?: number;
}
