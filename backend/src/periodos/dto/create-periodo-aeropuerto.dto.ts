import { IsInt, IsOptional, IsString, MaxLength, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePeriodoAeropuertoDto {
  @ApiProperty({ description: 'ID del aeropuerto' })
  @Type(() => Number)
  @IsInt()
  idAeropuerto: number;

  @ApiProperty({ description: 'ID del período' })
  @Type(() => Number)
  @IsInt()
  idPeriodo: number;

  @ApiPropertyOptional({ description: 'Abierto (S/N)', default: 'S' })
  @IsOptional()
  @IsString()
  @MaxLength(1)
  @IsIn(['S', 'N'])
  abierto?: string;
}
