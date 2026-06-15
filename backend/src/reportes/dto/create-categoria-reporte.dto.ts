import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoriaReporteDto {
  @ApiProperty({ description: 'Nombre de la categoría', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  nombre: string;
}
