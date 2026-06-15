import { IsString, IsOptional, IsNumber, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTasaDto {
  @ApiProperty({ description: 'Código único de la tasa', maxLength: 25 })
  @IsString()
  @MaxLength(25)
  codigo: string;

  @ApiProperty({ description: 'Nombre de la tasa', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ required: false, description: 'Descripción de la tasa', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  descripcion?: string;

  @ApiProperty({ description: 'Valor de la tasa' })
  @IsNumber()
  valor: number;
}
