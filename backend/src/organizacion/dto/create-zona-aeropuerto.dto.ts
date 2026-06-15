import { IsString, IsInt, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateZonaAeropuertoDto {
  @ApiProperty({ description: 'ID del aeropuerto' })
  @IsInt()
  idAeropuerto: number;

  @ApiProperty({ description: 'Código de la zona del aeropuerto', maxLength: 25 })
  @IsString()
  @MaxLength(25)
  codigo: string;

  @ApiProperty({ description: 'Nombre de la zona del aeropuerto', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  nombre: string;
}
