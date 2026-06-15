import { IsString, IsInt, IsOptional, IsNumber, IsDateString, IsIn, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTarifaOperacionDto {
  @ApiProperty({ description: 'Código único de la tarifa', maxLength: 25 })
  @IsString()
  @MaxLength(25)
  codigo: string;

  @ApiProperty({ description: 'ID del tipo de operación asociado' })
  @IsInt()
  idTipoOperacion: number;

  @ApiProperty({ description: 'Tarifa por kilo local' })
  @IsNumber()
  tarifaKiloLocal: number;

  @ApiProperty({ description: 'Tarifa por kilo extranjero' })
  @IsNumber()
  tarifaKiloExtranjero: number;

  @ApiProperty({ description: 'Fecha inicial de vigencia' })
  @IsDateString()
  fechaInicial: string;

  @ApiProperty({ description: "Rango: 'S' = Simple (una tarifa), 'R' = Rango (por pesos)" })
  @IsString()
  @IsIn(['S', 'R'], { message: "rango debe ser 'S' (Simple) o 'R' (Rango)" })
  @MaxLength(1)
  rango: string;

  @ApiProperty({ required: false, description: 'Inicio del rango de peso (requerido si rango = R)' })
  @IsOptional()
  @IsNumber()
  rangoInicial?: number;

  @ApiProperty({ required: false, description: 'Fin del rango de peso (requerido si rango = R)' })
  @IsOptional()
  @IsNumber()
  rangoFinal?: number;

  @ApiProperty({ required: false, description: 'ID del aeropuerto (opcional, null = aplica a todos)' })
  @IsOptional()
  @IsInt()
  idAeropuerto?: number;

  @ApiProperty({ required: false, description: 'Tarifa local sin ajuste' })
  @IsOptional()
  @IsNumber()
  tarifaLocalSinAjuste?: number;

  @ApiProperty({ required: false, description: 'Tarifa extranjero sin ajuste' })
  @IsOptional()
  @IsNumber()
  tarifaExtranjeroSinAjuste?: number;
}
