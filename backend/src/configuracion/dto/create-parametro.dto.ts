import { IsString, IsOptional, IsBoolean, IsInt, IsIn, MaxLength, MinLength, Matches } from 'class-validator';

export class CreateParametroDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[A-Z_]+$/, { message: 'El código debe ser en mayúsculas con guiones bajos (Ej. OP_COBRO_PUENTE)' })
  codigo: string;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  nombre: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  valor?: string;

  @IsString()
  @IsIn(['STRING', 'NUMBER', 'BOOLEAN', 'OPTIONS'], {
    message: 'El tipo debe ser STRING, NUMBER, BOOLEAN u OPTIONS',
  })
  tipo: string;

  @IsString()
  @MaxLength(100)
  modulo: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  opciones?: string; // "S,N" o "COP,USD,EUR"

  @IsOptional()
  @IsInt()
  orden?: number;

  @IsOptional()
  @IsBoolean()
  editable?: boolean;

  @IsOptional()
  @IsBoolean()
  visible?: boolean;
}
