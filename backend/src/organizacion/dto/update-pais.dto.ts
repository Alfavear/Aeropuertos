import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePaisDto {
  @ApiPropertyOptional({ description: 'Código ISO del país', maxLength: 10 })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  codigo?: string;

  @ApiPropertyOptional({ description: 'Nombre del país', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre?: string;

  @ApiPropertyOptional({ description: 'Nacionalidad', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nacionalidad?: string;
}
