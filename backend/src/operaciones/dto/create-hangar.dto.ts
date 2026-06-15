import { IsString, IsInt, IsOptional, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHangarDto {
  @ApiProperty({ description: 'Código único del hangar por aeropuerto', maxLength: 25 })
  @IsString()
  @MaxLength(25)
  codigo: string;

  @ApiProperty({ required: false, description: 'Descripción del hangar', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  descripcion?: string;

  @ApiProperty({ required: false, description: 'Ubicación del hangar', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  ubicacion?: string;

  @ApiProperty({ description: 'ID del aeropuerto' })
  @IsInt()
  idAeropuerto: number;

  @ApiProperty({ description: 'Tipo de zona' })
  @IsInt()
  tipoZona: number;

  @ApiProperty({ required: false, description: 'Zona DEF asociada' })
  @IsOptional()
  @IsInt()
  zonaDef?: number;

  @ApiProperty({ required: false, default: false, description: 'Genera recargo nocturno' })
  @IsOptional()
  @IsBoolean()
  genRecNoc?: boolean;
}
