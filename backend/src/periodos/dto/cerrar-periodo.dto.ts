import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CerrarPeriodoDto {
  @ApiPropertyOptional({ description: 'Usuario que realiza el cierre', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  usuario?: string;
}
