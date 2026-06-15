import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTipoEventoDto {
  @ApiProperty({ description: 'Código único del tipo de evento (PK)', maxLength: 10 })
  @IsString()
  @MaxLength(10)
  codigo: string;

  @ApiPropertyOptional({ description: 'Nombre del tipo de evento', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nombre?: string;

  @ApiPropertyOptional({ description: 'Descripción del tipo de evento', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  descripcion?: string;
}
