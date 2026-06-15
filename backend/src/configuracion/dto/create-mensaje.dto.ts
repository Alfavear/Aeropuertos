import { IsString, IsOptional, IsBoolean, IsInt, IsDateString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMensajeDto {
  @ApiProperty({ description: 'Código único del mensaje', maxLength: 50 })
  @IsString()
  @MaxLength(50)
  codigo: string;

  @ApiPropertyOptional({ description: 'Título del mensaje', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  titulo?: string;

  @ApiPropertyOptional({ description: 'Contenido del mensaje' })
  @IsOptional()
  @IsString()
  mensaje?: string;

  @ApiPropertyOptional({ description: 'Tipo de mensaje', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  tipo?: string;

  @ApiPropertyOptional({ description: 'ID del usuario destino (null = mensaje global)' })
  @IsOptional()
  @IsInt()
  idUsuario?: number;

  @ApiPropertyOptional({ description: 'Fecha del mensaje' })
  @IsOptional()
  @IsDateString()
  fecha?: string;
}
