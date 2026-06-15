import { IsString, IsInt, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHorarioAeropuertoDto {
  @ApiProperty({ description: 'ID del aeropuerto' })
  @IsInt()
  idAeropuerto: number;

  @ApiProperty({ description: 'Día de la semana', maxLength: 50 })
  @IsString()
  @MaxLength(50)
  dia: string;

  @ApiProperty({ description: 'Hora de inicio (HHmm)', maxLength: 4 })
  @IsString()
  @MaxLength(4)
  horaIni: string;

  @ApiProperty({ description: 'Hora de fin (HHmm)', maxLength: 4 })
  @IsString()
  @MaxLength(4)
  horaFin: string;

  @ApiProperty({ description: 'Operación 24 horas', default: false })
  @IsBoolean()
  veinticuatroHoras: boolean;
}
