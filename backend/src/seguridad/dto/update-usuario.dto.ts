import { IsString, IsOptional, IsInt, IsBoolean, MaxLength, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUsuarioDto {
  @ApiPropertyOptional({ description: 'Nombre de usuario único', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  username?: string;

  @ApiPropertyOptional({ description: 'Contraseña del usuario', minLength: 6, maxLength: 500 })
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(500)
  password?: string;

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

  @ApiPropertyOptional({ description: 'Usuario activo' })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @ApiPropertyOptional({ description: 'Usuario bloqueado' })
  @IsOptional()
  @IsBoolean()
  bloqueado?: boolean;

  @ApiPropertyOptional({ description: 'Debe cambiar la contraseña en el próximo inicio de sesión' })
  @IsOptional()
  @IsBoolean()
  debeCambiarPass?: boolean;

  @ApiPropertyOptional({ description: 'Fecha de vencimiento de la cuenta' })
  @IsOptional()
  fechaVence?: string;
}
