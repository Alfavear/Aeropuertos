import { IsString, IsOptional, IsNumber, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAcuerdoPagoDto {
  @ApiProperty({ description: 'Código de la aerolínea', maxLength: 25 })
  @IsString()
  @MaxLength(25)
  codAerolinea: string;

  @ApiProperty({ description: 'Fuente', maxLength: 2 })
  @IsString()
  @MaxLength(2)
  fuente: string;

  @ApiProperty({ description: 'Documento', maxLength: 10 })
  @IsString()
  @MaxLength(10)
  documento: string;

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

  @ApiProperty({ description: 'Usuario', maxLength: 50 })
  @IsString()
  @MaxLength(50)
  usuario: string;

  @ApiProperty({ description: 'Business Unit', maxLength: 25 })
  @IsString()
  @MaxLength(25)
  bu: string;
}
