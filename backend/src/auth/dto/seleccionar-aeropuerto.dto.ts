import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SeleccionarAeropuertoDto {
  @ApiProperty({ description: 'ID del aeropuerto a seleccionar' })
  @IsInt()
  idAeropuerto: number;
}
