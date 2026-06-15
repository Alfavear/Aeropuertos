import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AbrirPeriodoDto {
  @ApiPropertyOptional({ description: 'Usuario que realiza la apertura', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  usuario?: string;
}
