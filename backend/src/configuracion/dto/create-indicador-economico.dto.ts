import { IsString, IsNumber, IsOptional, IsDateString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateIndicadorEconomicoDto {
  @ApiProperty({ description: 'Código del indicador (TRM, IPC, UVT)', maxLength: 25 })
  @IsString()
  @MaxLength(25)
  codigo: string;

  @ApiProperty({ description: 'Descripción del indicador', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  descripcion: string;

  @ApiPropertyOptional({ description: 'Fecha del valor' })
  @IsOptional()
  @IsDateString()
  fecha?: string;

  @ApiProperty({ description: 'Valor del indicador' })
  @IsNumber()
  valor: number;

  @ApiPropertyOptional({ description: 'Fecha próxima proyección' })
  @IsOptional()
  @IsDateString()
  fechaProx?: string;

  @ApiPropertyOptional({ description: 'Valor próximo proyectado' })
  @IsOptional()
  @IsNumber()
  valorProx?: number;
}
