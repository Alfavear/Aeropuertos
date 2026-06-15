import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFabricanteDto {
  @ApiPropertyOptional({ description: 'Código del fabricante', maxLength: 10 })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  codigo?: string;

  @ApiPropertyOptional({ description: 'Nombre del fabricante', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nombre?: string;

  @ApiPropertyOptional({ description: 'NIT', maxLength: 25 })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  nit?: string;

  @ApiPropertyOptional({ description: 'Dirección', maxLength: 80 })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  direccion?: string;

  @ApiPropertyOptional({ description: 'Ciudad', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  ciudad?: string;

  @ApiPropertyOptional({ description: 'Teléfono', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  telefono?: string;

  @ApiPropertyOptional({ description: 'Fax', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  fax?: string;

  @ApiPropertyOptional({ description: 'Sitio web', maxLength: 60 })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  website?: string;

  @ApiPropertyOptional({ description: 'Email', maxLength: 60 })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  email?: string;
}
