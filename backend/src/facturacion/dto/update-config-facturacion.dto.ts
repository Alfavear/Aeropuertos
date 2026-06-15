import { IsString, IsBoolean, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateConfigFacturacionDto {
  @ApiPropertyOptional({ description: 'ID del cliente', maxLength: 25 })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  idCliente?: string;

  @ApiPropertyOptional({ description: 'Nombre de la configuración', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nombre?: string;

  @ApiPropertyOptional({ description: 'Tipo de facturación', maxLength: 25 })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  tipoFacturacion?: string;

  @ApiPropertyOptional({ description: 'Separa facturas' })
  @IsOptional()
  @IsBoolean()
  separaFacturas?: boolean;
}
