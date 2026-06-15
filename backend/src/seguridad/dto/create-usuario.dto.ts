import { IsString, IsOptional, IsInt, IsBoolean, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({ description: 'Nombre de usuario único', maxLength: 50 })
  @IsString()
  @MaxLength(50)
  username: string;

  @ApiProperty({ description: 'Contraseña del usuario', minLength: 6, maxLength: 500 })
  @IsString()
  @MinLength(6)
  @MaxLength(500)
  password: string;

  @ApiPropertyOptional({ description: 'Nombre completo del usuario', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre?: string;

  @ApiPropertyOptional({ description: 'Correo electrónico', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  email?: string;

  @ApiPropertyOptional({ description: 'Teléfono', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  telefono?: string;

  @ApiPropertyOptional({ description: 'ID del perfil asignado' })
  @IsOptional()
  @IsInt()
  idPerfil?: number;

  @ApiPropertyOptional({ description: 'Fecha de vencimiento de la cuenta' })
  @IsOptional()
  fechaVence?: string;
}
