import { IsString, IsInt, IsOptional, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVueloDto {
  @ApiProperty({ description: 'Código único del vuelo', maxLength: 25 })
  @IsString()
  @MaxLength(25)
  codigo: string;

  @ApiProperty({ description: 'Número de vuelo', maxLength: 25 })
  @IsString()
  @MaxLength(25)
  numeroVuelo: string;

  @ApiProperty({ description: 'ID de la aerolínea' })
  @IsInt()
  idAerolinea: number;

  @ApiProperty({ required: false, description: 'ID del aeropuerto de origen' })
  @IsOptional()
  @IsInt()
  origen?: number;

  @ApiProperty({ required: false, description: 'ID del aeropuerto de destino' })
  @IsOptional()
  @IsInt()
  destino?: number;

  @ApiProperty({ required: false, default: true, description: 'Indica si el vuelo está activo' })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
