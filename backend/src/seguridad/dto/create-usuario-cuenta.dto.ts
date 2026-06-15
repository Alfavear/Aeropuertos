import { IsInt, IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUsuarioCuentaDto {
  @ApiProperty({ description: 'ID del usuario' })
  @IsInt()
  idUsuario: number;

  @ApiProperty({ description: 'Cuenta contable', maxLength: 16 })
  @IsString()
  @MaxLength(16)
  cuenta: string;

  @ApiPropertyOptional({ description: 'Descripción de la cuenta', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  descripcion?: string;
}
