import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEventoDto {
  @ApiProperty({ description: 'Código del tipo de evento (FK a TipoEvento)', maxLength: 10 })
  @IsString()
  @MaxLength(10)
  codigoTipo: string;

  @ApiProperty({ description: 'Código único del evento por tipo', maxLength: 10 })
  @IsString()
  @MaxLength(10)
  codigo: string;

  @ApiPropertyOptional({ description: 'Nombre del evento', maxLength: 150 })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  nombre?: string;

  @ApiPropertyOptional({ description: 'Descripción del evento', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  descripcion?: string;

  @ApiPropertyOptional({ description: 'Deshabilitar evento', default: false })
  @IsOptional()
  @IsBoolean()
  deshabilitar?: boolean;
}
