import { IsInt, IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFuenteFacturacionDto {
  @ApiProperty({ description: 'ID del aeropuerto' })
  @IsInt()
  idAeropuerto: number;

  @ApiPropertyOptional({ description: 'Fuente contado', maxLength: 2 })
  @IsOptional()
  @IsString()
  @MaxLength(2)
  fuenteContado?: string;

  @ApiPropertyOptional({ description: 'Fuente crédito', maxLength: 2 })
  @IsOptional()
  @IsString()
  @MaxLength(2)
  fuenteCredito?: string;

  @ApiPropertyOptional({ description: 'Serie contado', maxLength: 2 })
  @IsOptional()
  @IsString()
  @MaxLength(2)
  serieContado?: string;

  @ApiPropertyOptional({ description: 'Serie crédito', maxLength: 2 })
  @IsOptional()
  @IsString()
  @MaxLength(2)
  serieCredito?: string;

  @ApiPropertyOptional({ description: 'Fuente nota', maxLength: 2 })
  @IsOptional()
  @IsString()
  @MaxLength(2)
  fuenteNota?: string;

  @ApiPropertyOptional({ description: 'Serie nota', maxLength: 2 })
  @IsOptional()
  @IsString()
  @MaxLength(2)
  serieNota?: string;
}
