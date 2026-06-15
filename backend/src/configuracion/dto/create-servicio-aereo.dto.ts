import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateServicioAereoDto {
  @ApiProperty({ description: 'Código único del servicio', maxLength: 25 })
  @IsString()
  @MaxLength(25)
  codigo: string;

  @ApiProperty({ description: 'Nombre del servicio', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  nombre: string;

  @ApiPropertyOptional({ description: 'Descripción del servicio', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  descripcion?: string;
}
