import { IsInt, IsOptional, IsString, IsDateString, IsIn, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDiaAeropuertoDto {
  @ApiProperty({ description: 'ID del período' })
  @Type(() => Number)
  @IsInt()
  idPeriodo: number;

  @ApiProperty({ description: 'Día (formato YYYY-MM-DD)' })
  @IsDateString()
  dia: string;

  @ApiPropertyOptional({ description: 'Abierto (S/N)', default: 'S' })
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
