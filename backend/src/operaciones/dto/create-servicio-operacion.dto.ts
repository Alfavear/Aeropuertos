import { IsString, IsInt, IsOptional, IsNumber, IsDateString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServicioOperacionDto {
  @ApiProperty({ description: 'ID de la operación' })
  @IsInt()
  idOperacion: number;

  @ApiProperty({ description: 'Tipo de servicio', maxLength: 50 })
  @IsString()
  @MaxLength(50)
  tipoServicio: string;

  @ApiProperty({ required: false, description: 'Fecha del servicio (ISO date)' })
  @IsOptional()
  @IsDateString()
  fecha?: string;

  @ApiProperty({ required: false, description: 'Valor del servicio' })
  @IsOptional()
  @IsNumber()
  valor?: number;

  @ApiProperty({ required: false, description: 'Observaciones', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  observacion?: string;
}
