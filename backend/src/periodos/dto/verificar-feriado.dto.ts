import { ApiProperty } from '@nestjs/swagger';

export class VerificarFeriadoDto {
  @ApiProperty({ description: 'Indica si la fecha es feriado' })
  esFeriado: boolean;
}
