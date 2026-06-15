import { IsString, IsInt, IsOptional, IsDateString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotaOperacionDto {
  @ApiProperty({ required: false, description: 'ID de la operación' })
  @IsOptional()
  @IsInt()
  idOperacion?: number;

  @ApiProperty({ required: false, description: 'Nota u observación' })
  @IsOptional()
  @IsString()
  nota?: string;

  @ApiProperty({ required: false, description: 'Usuario que registró la nota', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  usuario?: string;

  @ApiProperty({ required: false, description: 'Fecha de la nota (ISO date)' })
  @IsOptional()
  @IsDateString()
  fecha?: string;
}
