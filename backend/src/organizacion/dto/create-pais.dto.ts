import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaisDto {
  @ApiProperty({ description: 'Código ISO del país', maxLength: 10 })
  @IsString()
  @MaxLength(10)
  codigo: string;

  @ApiProperty({ description: 'Nombre del país', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  nombre: string;

  @ApiPropertyOptional({ description: 'Nacionalidad', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nacionalidad?: string;
}
