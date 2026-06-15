import { IsInt, IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUsuarioCuentaDto {
  @ApiPropertyOptional({ description: 'ID del usuario' })
  @IsOptional()
  @IsInt()
  idUsuario?: number;

  @ApiPropertyOptional({ description: 'Cuenta contable', maxLength: 16 })
  @IsOptional()
  @IsString()
  @MaxLength(16)
  cuenta?: string;

  @ApiPropertyOptional({ description: 'Descripción de la cuenta', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  descripcion?: string;
}
