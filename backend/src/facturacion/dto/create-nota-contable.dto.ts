import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNotaContableDto {
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

  @ApiPropertyOptional({ description: 'Fecha de la nota' })
  @IsOptional()
  @IsString()
  fecha?: string;

  @ApiPropertyOptional({ description: 'Concepto', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  concepto?: string;

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

  @ApiPropertyOptional({ description: 'Estado', maxLength: 25 })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  estado?: string;
}
