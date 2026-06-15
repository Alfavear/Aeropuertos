import { IsInt, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRegistroPesoDto {
  @ApiProperty({ description: 'ID de la operación' })
  @IsInt()
  idOperacion: number;

  @ApiProperty({ description: 'Peso registrado' })
  @IsNumber()
  peso: number;

  @ApiProperty({ required: false, description: 'Fecha del registro (ISO date)' })
  @IsOptional()
  @IsDateString()
  fecha?: string;
}
