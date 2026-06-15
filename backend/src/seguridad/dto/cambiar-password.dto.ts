import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CambiarPasswordDto {
  @ApiProperty({ description: 'Contraseña actual' })
  @IsString()
  passwordActual: string;

  @ApiProperty({ description: 'Nueva contraseña', minLength: 6, maxLength: 500 })
  @IsString()
  @MinLength(6)
  @MaxLength(500)
  passwordNueva: string;
}
