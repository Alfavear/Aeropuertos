import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSesionUsuarioDto {
  @ApiProperty({ description: 'ID del usuario' })
  @IsInt()
  idUsuario: number;

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
