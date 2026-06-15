import { IsString, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConfigFacturacionDto {
  @ApiProperty({ description: 'ID del cliente', maxLength: 25 })
  @IsString()
  @MaxLength(25)
  idCliente: string;

  @ApiProperty({ description: 'Nombre de la configuración', maxLength: 50 })
  @IsString()
  @MaxLength(50)
  nombre: string;

  @ApiProperty({ description: 'Tipo de facturación', maxLength: 25 })
  @IsString()
  @MaxLength(25)
  tipoFacturacion: string;

  @ApiProperty({ description: 'Separa facturas', default: false })
  @IsBoolean()
  separaFacturas: boolean;
}
