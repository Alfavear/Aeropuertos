import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateZonaDto {
  @ApiProperty({ description: 'Código de la zona', maxLength: 25 })
  @IsString()
  @MaxLength(25)
  codigo: string;

  @ApiProperty({ description: 'Nombre de la zona', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  nombre: string;
}
