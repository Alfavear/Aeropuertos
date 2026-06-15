import { IsString, IsOptional, IsInt, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMenuOpcionDto {
  @ApiPropertyOptional({ description: 'ID del padre (para jerarquía)' })
  @IsOptional()
  @IsInt()
  idPadre?: number;

  @ApiProperty({ description: 'Nombre de la opción de menú', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  nombre: string;

  @ApiPropertyOptional({ description: 'Descripción', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  descripcion?: string;

  @ApiPropertyOptional({ description: 'Ruta de navegación', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  ruta?: string;

  @ApiPropertyOptional({ description: 'Icono', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  icono?: string;

  @ApiPropertyOptional({ description: 'Orden de visualización' })
  @IsOptional()
  @IsInt()
  orden?: number;

  @ApiPropertyOptional({ description: 'Opción activa' })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
