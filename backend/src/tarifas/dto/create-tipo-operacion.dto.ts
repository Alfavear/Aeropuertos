import { IsString, IsInt, Min, Max, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTipoOperacionDto {
  @ApiProperty({ description: 'Código único del tipo de operación', maxLength: 25 })
  @IsString()
  @MaxLength(25)
  codigo: string;

  @ApiProperty({ description: 'Nombre del tipo de operación', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ description: 'ID del concepto asociado' })
  @IsInt()
  idConcepto: number;

  @ApiProperty({ description: 'Tipo de tarifa: 0=Unitario, 1=Peso, 2=Por operación, 3=Por hora', minimum: 0, maximum: 3 })
  @IsInt()
  @Min(0)
  @Max(3)
  tipoTarifa: number;
}
