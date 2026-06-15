import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSesionUsuarioDto {
  @ApiPropertyOptional({ description: 'ID del usuario' })
  @IsOptional()
  @IsInt()
  idUsuario?: number;

  @ApiPropertyOptional({ description: 'ID del aeropuerto' })
  @IsOptional()
  @IsInt()
  idAeropuerto?: number;

  @ApiPropertyOptional({ description: 'Dirección IP', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  ip?: string;
}
