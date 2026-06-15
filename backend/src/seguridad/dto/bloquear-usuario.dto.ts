import { IsBoolean, IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class BloquearUsuarioDto {
  @ApiPropertyOptional({ description: 'Bloqueo programado' })
  @IsOptional()
  @IsBoolean()
  bloqueoProgramado?: boolean;

  @ApiPropertyOptional({ description: 'Bloqueo por movimiento' })
  @IsOptional()
  @IsBoolean()
  bloqueoMovimiento?: boolean;

  @ApiPropertyOptional({ description: 'Bloqueo severo' })
  @IsOptional()
  @IsBoolean()
  bloqueoSevero?: boolean;

  @ApiPropertyOptional({ description: 'Fecha de inicio del bloqueo programado' })
  @IsOptional()
  @IsDateString()
  fechaInicioBloqueo?: string;
}
