import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FacturacionService } from './facturacion.service';

@ApiTags('Facturación')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('facturacion')
export class FacturacionController {
  constructor(private readonly facturacionService: FacturacionService) {}

  @Get('facturas')
  @ApiOperation({ summary: 'Listar facturas' })
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.facturacionService.findAllFacturas({
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
    });
  }

  @Get('facturas/:id')
  @ApiOperation({ summary: 'Obtener factura por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.facturacionService.findFacturaById(id);
  }

  @Post('facturas')
  @ApiOperation({ summary: 'Crear factura' })
  async create(@Body() data: any) {
    return this.facturacionService.createFactura(data);
  }

  @Put('facturas/:id')
  @ApiOperation({ summary: 'Actualizar factura' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: any,
  ) {
    return this.facturacionService.updateFactura(id, data);
  }

  @Delete('facturas/:id')
  @ApiOperation({ summary: 'Eliminar factura' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.facturacionService.deleteFactura(id);
  }
}
