import { IsString, IsInt, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCiudadDto {
  @ApiProperty({ description: 'Código de la ciudad', maxLength: 25 })
  @IsString()
  @MaxLength(25)
  codigo: string;

  @ApiProperty({ description: 'Nombre de la ciudad', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ description: 'ID del país al que pertenece' })
  @IsInt()
  idPais: number;
}
