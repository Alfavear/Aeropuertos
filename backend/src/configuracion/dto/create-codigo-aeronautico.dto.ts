import { IsString, IsInt, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCodigoAeronauticoDto {
  @ApiProperty({ description: 'Código OACI o IATA', maxLength: 50 })
  @IsString()
  @MaxLength(50)
  codigo: string;

  @ApiProperty({ description: 'Descripción del código', maxLength: 150 })
  @IsString()
  @MaxLength(150)
  descripcion: string;

  @ApiProperty({ description: 'Tipo: 1=OACI aerolínea, 2=IATA aerolínea, 3=OACI aeropuerto, 4=IATA aeropuerto' })
  @IsInt()
  @Min(1)
  tipo: number;
}
