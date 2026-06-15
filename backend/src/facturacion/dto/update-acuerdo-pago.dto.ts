import { IsString, IsOptional, IsNumber, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAcuerdoPagoDto {
  @ApiPropertyOptional({ description: 'Código de la aerolínea', maxLength: 25 })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  codAerolinea?: string;

  @ApiPropertyOptional({ description: 'Fuente', maxLength: 2 })
  @IsOptional()
  @IsString()
  @MaxLength(2)
  fuente?: string;

  @ApiPropertyOptional({ description: 'Documento', maxLength: 10 })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  documento?: string;

  @ApiPropertyOptional({ description: 'Fecha de creación' })
  @IsOptional()
  @IsString()
  fechaCreacion?: string;

  @ApiPropertyOptional({ description: 'Fecha de inicio' })
  @IsOptional()
  @IsString()
  fechaInicio?: string;

  @ApiPropertyOptional({ description: 'Fecha de vencimiento' })
  @IsOptional()
  @IsString()
  fechaVenc?: string;

  @ApiPropertyOptional({ description: 'Valor del acuerdo' })
  @IsOptional()
  @IsNumber()
  valor?: number;

  @ApiPropertyOptional({ description: 'Estado', maxLength: 25 })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  estado?: string;

  @ApiPropertyOptional({ description: 'Observación', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  observacion?: string;

  @ApiPropertyOptional({ description: 'Usuario', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  usuario?: string;

  @ApiPropertyOptional({ description: 'Business Unit', maxLength: 25 })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  bu?: string;
}
