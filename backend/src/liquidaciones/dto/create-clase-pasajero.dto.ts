import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClasePasajeroDto {
  @ApiProperty({ description: 'Código de la clase de pasajero', maxLength: 3 })
  @IsString()
  @MaxLength(3)
  codigo: string;

  @ApiProperty({ description: 'Nombre de la clase de pasajero', maxLength: 25 })
  @IsString()
  @MaxLength(25)
  nombre: string;

  @ApiProperty({ description: 'Descripción de la clase de pasajero', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  descripcion: string;
}
