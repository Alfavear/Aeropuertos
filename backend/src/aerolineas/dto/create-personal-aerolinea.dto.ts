import { IsString, IsOptional, IsInt, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePersonalAerolineaDto {
  @ApiProperty({ description: 'Identificación del personal', maxLength: 25 })
  @IsString()
  @MaxLength(25)
  identificacion: string;

  @ApiProperty({ description: 'Nombre del personal', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  nombre: string;

  @ApiPropertyOptional({ description: 'ID de la aerolínea' })
  @IsOptional()
  @IsInt()
  idAerolinea?: number;

  @ApiProperty({ description: 'Cargo', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  cargo: string;
}
