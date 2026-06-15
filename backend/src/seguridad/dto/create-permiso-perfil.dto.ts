import { IsInt, IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePermisoPerfilDto {
  @ApiProperty({ description: 'ID del perfil' })
  @IsInt()
  idPerfil: number;

  @ApiProperty({ description: 'Nombre del recurso', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  recurso: string;

  @ApiPropertyOptional({ description: 'Nivel de permiso' })
  @IsOptional()
  @IsInt()
  permiso?: number;
}
