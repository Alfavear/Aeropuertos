import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGrupoConceptoDto {
  @ApiProperty({ description: 'Código único del grupo', maxLength: 25 })
  @IsString()
  @MaxLength(25)
  codigo: string;

  @ApiProperty({ description: 'Descripción del grupo', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  descripcion: string;
}
