import { IsOptional, IsString, MaxLength, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePeriodoAeropuertoDto {
  @ApiPropertyOptional({ description: 'Abierto (S/N)' })
  @IsOptional()
  @IsString()
  @MaxLength(1)
  @IsIn(['S', 'N'])
  abierto?: string;
}
