import { IsString, IsNumber, IsOptional, IsDateString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateIndicadorEconomicoDto {
  @ApiPropertyOptional({ description: 'Código del indicador (TRM, IPC, UVT)', maxLength: 25 })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  codigo?: string;

  @ApiPropertyOptional({ description: 'Descripción del indicador', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  descripcion?: string;

  @ApiPropertyOptional({ description: 'Fecha del valor' })
  @IsOptional()
  @IsDateString()
  fecha?: string;

  @ApiPropertyOptional({ description: 'Valor del indicador' })
  @IsOptional()
  @IsNumber()
  valor?: number;

  @ApiPropertyOptional({ description: 'Fecha próxima proyección' })
  @IsOptional()
  @IsDateString()
  fechaProx?: string;

  @ApiPropertyOptional({ description: 'Valor próximo proyectado' })
  @IsOptional()
  @IsNumber()
  valorProx?: number;
}
