import { IsString, IsOptional, IsBoolean, IsInt, IsIn, MaxLength, MinLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateParametroSistemaDto {
  @ApiProperty({ description: 'Código técnico único (Ej. OP_COBRO_PUENTE)', maxLength: 50 })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[A-Z_0-9]+$/, { message: 'Solo mayúsculas, números y guiones bajos' })
  codigo: string;

  @ApiProperty({ description: 'Nombre visible del parámetro', maxLength: 100 })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  nombre: string;

  @ApiPropertyOptional({ description: 'Explicación detallada del parámetro', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string;

  @ApiPropertyOptional({ description: 'Valor actual del parámetro', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  valor?: string;

  @ApiProperty({
    description: 'Tipo de dato: STRING, NUMBER, BOOLEAN u OPTIONS',
    enum: ['STRING', 'NUMBER', 'BOOLEAN', 'OPTIONS'],
  })
  @IsString()
  @IsIn(['STRING', 'NUMBER', 'BOOLEAN', 'OPTIONS'], {
    message: 'El tipo debe ser STRING, NUMBER, BOOLEAN u OPTIONS',
  })
  tipo: string;

  @ApiProperty({ description: 'Módulo al que pertenece (Operaciones, Facturación, etc.)', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  modulo: string;

  @ApiPropertyOptional({
    description: 'Opciones permitidas separadas por comas (solo si tipo=OPTIONS). Ej: "S,N" o "COP,USD,EUR"',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  opciones?: string;

  @ApiPropertyOptional({ description: 'Posición de ordenamiento dentro del módulo' })
  @IsOptional()
  @IsInt()
  orden?: number;

  @ApiPropertyOptional({ description: '¿Es editable por el usuario final?' })
  @IsOptional()
  @IsBoolean()
  editable?: boolean;

  @ApiPropertyOptional({ description: '¿Es visible en la interfaz?' })
  @IsOptional()
  @IsBoolean()
  visible?: boolean;
}
