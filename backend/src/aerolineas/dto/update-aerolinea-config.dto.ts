import { IsInt, IsOptional, IsBoolean, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAerolineaConfigDto {
  @ApiPropertyOptional({ description: 'ID de la aerolínea' })
  @IsOptional()
  @IsInt()
  idAerolinea?: number;

  @ApiPropertyOptional({ description: 'ID del aeropuerto' })
  @IsOptional()
  @IsInt()
  idAeropuerto?: number;

  @ApiPropertyOptional({ description: 'Horario único' })
  @IsOptional()
  @IsBoolean()
  horarioUnico?: boolean;

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

  @ApiPropertyOptional({ description: 'Aplicar descuento hora valle' })
  @IsOptional()
  @IsBoolean()
  aplicarDescHV?: boolean;
}
