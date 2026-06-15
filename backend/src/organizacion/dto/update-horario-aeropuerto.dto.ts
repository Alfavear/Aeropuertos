import { IsString, IsInt, IsBoolean, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateHorarioAeropuertoDto {
  @ApiPropertyOptional({ description: 'ID del aeropuerto' })
  @IsOptional()
  @IsInt()
  idAeropuerto?: number;

  @ApiPropertyOptional({ description: 'Día de la semana', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  dia?: string;

  @ApiPropertyOptional({ description: 'Hora de inicio (HHmm)', maxLength: 4 })
  @IsOptional()
  @IsString()
  @MaxLength(4)
  horaIni?: string;

  @ApiPropertyOptional({ description: 'Hora de fin (HHmm)', maxLength: 4 })
  @IsOptional()
  @IsString()
  @MaxLength(4)
  horaFin?: string;

  @ApiPropertyOptional({ description: 'Operación 24 horas' })
  @IsOptional()
  @IsBoolean()
  veinticuatroHoras?: boolean;
}
