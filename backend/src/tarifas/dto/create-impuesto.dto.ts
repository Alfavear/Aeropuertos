import { IsString, IsOptional, IsNumber, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateImpuestoDto {
  @ApiProperty({ description: 'Código único del impuesto (PK)', maxLength: 25 })
  @IsString()
  @MaxLength(25)
  codigo: string;

  @ApiProperty({ description: 'Nombre del impuesto', maxLength: 200 })
  @IsString()
  @MaxLength(200)
  nombre: string;

  @ApiProperty({ required: false, description: 'Porcentaje del impuesto' })
  @IsOptional()
  @IsNumber()
  porcentaje?: number;

  @ApiProperty({ description: 'Cuenta contable', maxLength: 16 })
  @IsString()
  @MaxLength(16)
  cuenta: string;
}
