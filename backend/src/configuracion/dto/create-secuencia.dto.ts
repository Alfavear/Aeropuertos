import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSecuenciaDto {
  @ApiProperty({ description: 'Nombre único de la secuencia', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  nombre: string;
}
