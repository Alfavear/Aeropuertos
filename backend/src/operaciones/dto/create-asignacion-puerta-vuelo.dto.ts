import { IsInt, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAsignacionPuertaVueloDto {
  @ApiProperty({ required: false, description: 'ID de la operación' })
  @IsOptional()
  @IsInt()
  idOperacion?: number;

  @ApiProperty({ required: false, description: 'ID de la puerta de embarque' })
  @IsOptional()
  @IsInt()
  idPuerta?: number;

  @ApiProperty({ required: false, description: 'Fecha de asignación (ISO date)' })
  @IsOptional()
  @IsDateString()
  fecha?: string;

  @ApiProperty({ required: false, description: 'Hora inicio (ISO date)' })
  @IsOptional()
  @IsDateString()
  horaIni?: string;

  @ApiProperty({ required: false, description: 'Hora fin (ISO date)' })
  @IsOptional()
  @IsDateString()
  horaFin?: string;
}
