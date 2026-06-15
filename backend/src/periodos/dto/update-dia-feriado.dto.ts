import { IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDiaFeriadoDto {
  @ApiPropertyOptional({ description: 'Fecha del feriado (formato YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  fecha?: string;
}
