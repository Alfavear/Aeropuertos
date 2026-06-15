import { IsString, IsOptional, IsInt, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClaseAviacionDto {
  @ApiProperty({ description: 'Código de la clase de aviación', maxLength: 25 })
  @IsString()
  @MaxLength(25)
  codigo: string;

  @ApiProperty({ description: 'Descripción', maxLength: 150 })
  @IsString()
  @MaxLength(150)
  descripcion: string;

  @ApiPropertyOptional({ description: 'ID de la clase superior' })
  @IsOptional()
  @IsInt()
  claseSuperior?: number;
}
