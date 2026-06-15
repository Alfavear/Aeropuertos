import { IsString, IsInt, IsOptional, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePuertaEmbarqueDto {
  @ApiProperty({ description: 'ID del aeropuerto' })
  @IsInt()
  idAeropuerto: number;

  @ApiProperty({ description: 'Código único de la puerta por aeropuerto', maxLength: 25 })
  @IsString()
  @MaxLength(25)
  codigo: string;

  @ApiProperty({ description: 'Descripción o ubicación de la puerta', maxLength: 250 })
  @IsString()
  @MaxLength(250)
  descripcion: string;

  @ApiProperty({ required: false, default: true, description: 'Indica si la puerta está activa' })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
