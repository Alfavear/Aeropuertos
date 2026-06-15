import { IsInt, IsOptional, IsBoolean, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAerolineaConfigDto {
  @ApiProperty({ description: 'ID de la aerolínea' })
  @IsInt()
  idAerolinea: number;

  @ApiProperty({ description: 'ID del aeropuerto' })
  @IsInt()
  idAeropuerto: number;

  @ApiProperty({ description: 'Horario único', default: false })
  @IsBoolean()
  horarioUnico: boolean;

  @ApiPropertyOptional({ description: 'Hora valle inicio', maxLength: 4 })
  @IsOptional()
  @IsString()
  @MaxLength(4)
  horaValleIni?: string;

  @ApiPropertyOptional({ description: 'Hora valle fin', maxLength: 4 })
  @IsOptional()
  @IsString()
  @MaxLength(4)
  horaValleFin?: string;

  @ApiProperty({ description: 'Aplicar descuento hora valle', default: false })
  @IsBoolean()
  aplicarDescHV: boolean;
}
