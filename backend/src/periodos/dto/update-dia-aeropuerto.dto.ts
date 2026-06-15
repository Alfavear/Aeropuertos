import { IsOptional, IsString, IsIn, MaxLength, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDiaAeropuertoDto {
  @ApiPropertyOptional({ description: 'Abierto (S/N)' })
  @IsOptional()
  @IsString()
  @MaxLength(1)
  @IsIn(['S', 'N'])
  abierto?: string;

  @ApiPropertyOptional({ description: 'ID del aeropuerto' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  idAeropuerto?: number;
}
