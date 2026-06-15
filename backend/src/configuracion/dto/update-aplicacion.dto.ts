import { IsString, IsBoolean, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAplicacionDto {
  @ApiPropertyOptional({ description: 'Nombre único de la aplicación', maxLength: 30 })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  nombre?: string;

  @ApiPropertyOptional({ description: 'Habilitar aplicación' })
  @IsOptional()
  @IsBoolean()
  habilitar?: boolean;

  @ApiPropertyOptional({ description: 'Bloquear acceso backend' })
  @IsOptional()
  @IsBoolean()
  bloqueaBackend?: boolean;

  @ApiPropertyOptional({ description: 'Bloquear acceso frontend' })
  @IsOptional()
  @IsBoolean()
  bloqueaFrontend?: boolean;
}
