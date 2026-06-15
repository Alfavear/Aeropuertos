import { IsInt, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTarifaAerolineaDto {
  @ApiProperty({ description: 'ID de la tarifa de operación asociada' })
  @IsInt()
  idTarifaOperacion: number;

  @ApiProperty({ description: 'ID de la aerolínea' })
  @IsInt()
  idAerolinea: number;

  @ApiProperty({ description: 'Tarifa por kilo local negociada' })
  @IsNumber()
  tarifaKiloLocal: number;

  @ApiProperty({ description: 'Tarifa por kilo extranjero negociada' })
  @IsNumber()
  tarifaKiloExtranjero: number;
}
