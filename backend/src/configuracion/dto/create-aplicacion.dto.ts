import { IsString, IsBoolean, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAplicacionDto {
  @ApiProperty({ description: 'Nombre único de la aplicación', maxLength: 30 })
  @IsString()
  @MaxLength(30)
  nombre: string;

  @ApiPropertyOptional({ description: 'Habilitar aplicación', default: false })
  @IsOptional()
  @IsBoolean()
  habilitar?: boolean;

  @ApiPropertyOptional({ description: 'Bloquear acceso backend', default: false })
  @IsOptional()
  @IsBoolean()
  bloqueaBackend?: boolean;

  @ApiPropertyOptional({ description: 'Bloquear acceso frontend', default: false })
  @IsOptional()
  @IsBoolean()
  bloqueaFrontend?: boolean;
}
