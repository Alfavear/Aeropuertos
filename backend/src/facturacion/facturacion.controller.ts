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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AeropuertoActivoGuard } from '../auth/aeropuerto-activo.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { FacturacionService } from './facturacion.service';
import { FacturacionEngineService } from './facturacion-engine.service';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { CreateFacturaDetalleDto } from './dto/create-factura-detalle.dto';
import { UpdateFacturaDetalleDto } from './dto/update-factura-detalle.dto';
import { CreateFacturaPagoDto } from './dto/create-factura-pago.dto';
import { UpdateFacturaPagoDto } from './dto/update-factura-pago.dto';
import { CreateFacturaImpuestoDto } from './dto/create-factura-impuesto.dto';
import { UpdateFacturaImpuestoDto } from './dto/update-factura-impuesto.dto';
import { CreateNotaContableDto } from './dto/create-nota-contable.dto';
import { UpdateNotaContableDto } from './dto/update-nota-contable.dto';
import { CreateAcuerdoPagoDto } from './dto/create-acuerdo-pago.dto';
import { UpdateAcuerdoPagoDto } from './dto/update-acuerdo-pago.dto';
import { CreateFuenteFacturacionDto } from './dto/create-fuente-facturacion.dto';
import { UpdateFuenteFacturacionDto } from './dto/update-fuente-facturacion.dto';
import { CreateConfigFacturacionDto } from './dto/create-config-facturacion.dto';
import { UpdateConfigFacturacionDto } from './dto/update-config-facturacion.dto';
import { CreateMovimientoFacturacionDto } from './dto/create-movimiento-facturacion.dto';
import { UpdateMovimientoFacturacionDto } from './dto/update-movimiento-facturacion.dto';
import { CreateFolioDto } from './dto/create-folio.dto';
import { UpdateFolioDto } from './dto/update-folio.dto';
import { CreateFolioDetalleDto } from './dto/create-folio-detalle.dto';
import { UpdateFolioDetalleDto } from './dto/update-folio-detalle.dto';

@ApiTags('Facturación')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AeropuertoActivoGuard)
@Controller('facturacion')
export class FacturacionController {
  constructor(
    private readonly facturacionService: FacturacionService,
    private readonly engine: FacturacionEngineService,
  ) {}

  // ============================================================
  // FACTURAS
  // ============================================================

  @Get('facturas')
  @ApiOperation({ summary: 'Listar facturas' })
  findAllFacturas(
    @CurrentUser('idAeropuertoActivo') _idAeropuerto: number,
    @Query('idAerolinea') idAerolinea?: string,
    @Query('fuente') fuente?: string,
    @Query('estado') estado?: string,
    @Query('tipoFactura') tipoFactura?: string,
  ) {
    return this.facturacionService.findAllFacturas({ idAerolinea, fuente, estado, tipoFactura });
  }

  @Get('facturas/:id')
  @ApiOperation({ summary: 'Obtener factura por ID' })
  findOneFactura(@Param('id') id: string) {
    return this.facturacionService.findFacturaById(BigInt(id));
  }

  @Post('facturas')
  @ApiOperation({ summary: 'Crear factura' })
  createFactura(@Body() dto: CreateFacturaDto) {
    return this.facturacionService.createFactura(dto);
  }

  @Put('facturas/:id')
  @ApiOperation({ summary: 'Actualizar factura' })
  updateFactura(@Param('id') id: string, @Body() dto: UpdateFacturaDto) {
    return this.facturacionService.updateFactura(BigInt(id), dto);
  }

  @Delete('facturas/:id')
  @ApiOperation({ summary: 'Eliminar factura' })
  removeFactura(@Param('id') id: string) {
    return this.facturacionService.deleteFactura(BigInt(id));
  }

  // ============================================================
  // MOTOR DE FACTURACIÓN
  // ============================================================

  @Post('facturar/contado')
  @ApiOperation({ summary: 'Facturar movimientos al contado' })
  facturarContado(
    @CurrentUser('idAeropuertoActivo') idAeropuerto: number,
    @Body() dto: { idAerolinea: number; fuente: string; descripcion?: string; movimientos: number[] },
  ) {
    return this.engine.facturarContado({
      ...dto,
      idAeropuerto,
      tipoFactura: 1,
      idMoneda: 1,
      usuario: 'system',
      movimientos: dto.movimientos,
    });
  }

  @Post('facturar/credito')
  @ApiOperation({ summary: 'Facturar movimientos al crédito' })
  facturarCredito(
    @CurrentUser('idAeropuertoActivo') idAeropuerto: number,
    @Body() dto: { idAerolinea: number; fuente: string; descripcion?: string; movimientos: number[] },
  ) {
    return this.engine.facturarCredito({
      ...dto,
      idAeropuerto,
      tipoFactura: 2,
      idMoneda: 1,
      usuario: 'system',
      movimientos: dto.movimientos,
    });
  }

  @Post('facturas/:id/anular')
  @ApiOperation({ summary: 'Anular factura' })
  anularFactura(
    @Param('id') id: string,
    @Body() dto: { motivo: string },
    @CurrentUser('idAeropuertoActivo') idAeropuerto: number,
  ) {
    return this.engine.anularFactura(BigInt(id), dto.motivo, 'system', idAeropuerto);
  }

  // ============================================================
  // NOTAS CONTABLES (motor)
  // ============================================================

  @Post('notas-contables/debito')
  @ApiOperation({ summary: 'Crear nota contable débito' })
  crearNotaDebito(
    @CurrentUser('idAeropuertoActivo') idAeropuerto: number,
    @Body() dto: { concepto: string; fuente: string; idFactura?: string },
  ) {
    return this.engine.crearNotaContable({
      tipo: 'DB',
      concepto: dto.concepto,
      usuario: 'system',
      idAeropuerto,
      fuente: dto.fuente,
      idFactura: dto.idFactura ? BigInt(dto.idFactura) : undefined,
    });
  }

  @Post('notas-contables/credito')
  @ApiOperation({ summary: 'Crear nota contable crédito' })
  crearNotaCredito(
    @CurrentUser('idAeropuertoActivo') idAeropuerto: number,
    @Body() dto: { concepto: string; fuente: string; idFactura?: string },
  ) {
    return this.engine.crearNotaContable({
      tipo: 'CR',
      concepto: dto.concepto,
      usuario: 'system',
      idAeropuerto,
      fuente: dto.fuente,
      idFactura: dto.idFactura ? BigInt(dto.idFactura) : undefined,
    });
  }

  // ============================================================
  // FACTURAS DETALLE
  // ============================================================

  @Get('facturas-detalle')
  @ApiOperation({ summary: 'Listar detalles de factura' })
  findAllFacturasDetalle(@Query('idFactura') idFactura?: string, @Query('idConcepto') idConcepto?: string) {
    return this.facturacionService.findAllFacturasDetalle({ idFactura, idConcepto });
  }

  @Get('facturas-detalle/:id')
  @ApiOperation({ summary: 'Obtener detalle de factura por ID' })
  findOneFacturaDetalle(@Param('id') id: string) {
    return this.facturacionService.findFacturaDetalleById(BigInt(id));
  }

  @Post('facturas-detalle')
  @ApiOperation({ summary: 'Crear detalle de factura' })
  createFacturaDetalle(@Body() dto: CreateFacturaDetalleDto) {
    return this.facturacionService.createFacturaDetalle(dto);
  }

  // ============================================================
  // FACTURAS PAGOS
  // ============================================================

  @Get('facturas-pagos')
  @ApiOperation({ summary: 'Listar pagos de factura' })
  findAllFacturasPagos(@Query('idFactura') idFactura?: string, @Query('tipoPago') tipoPago?: string) {
    return this.facturacionService.findAllFacturasPagos({ idFactura, tipoPago });
  }

  // ============================================================
  // FACTURAS IMPUESTOS
  // ============================================================

  @Get('facturas-impuestos')
  @ApiOperation({ summary: 'Listar impuestos de factura' })
  findAllFacturasImpuestos(@Query('idFactura') idFactura?: string) {
    return this.facturacionService.findAllFacturasImpuestos({ idFactura });
  }

  // ============================================================
  // NOTAS CONTABLES (CRUD)
  // ============================================================

  @Get('notas-contables')
  @ApiOperation({ summary: 'Listar notas contables' })
  findAllNotasContables(@Query('estado') estado?: string, @Query('fuente') fuente?: string) {
    return this.facturacionService.findAllNotasContables({ estado, fuente });
  }

  // ============================================================
  // ACUERDOS PAGO
  // ============================================================

  @Get('acuerdos-pago')
  @ApiOperation({ summary: 'Listar acuerdos de pago' })
  findAllAcuerdosPago(@Query('codAerolinea') codAerolinea?: string, @Query('estado') estado?: string) {
    return this.facturacionService.findAllAcuerdosPago({ codAerolinea, estado });
  }

  // ============================================================
  // FUENTES FACTURACION (filtradas por aeropuerto activo)
  // ============================================================

  @Get('fuentes-facturacion')
  @ApiOperation({ summary: 'Listar fuentes de facturación del aeropuerto activo' })
  findAllFuentesFacturacion(@CurrentUser('idAeropuertoActivo') idAeropuerto: number) {
    return this.facturacionService.findAllFuentesFacturacion({ idAeropuerto: String(idAeropuerto) });
  }

  @Post('fuentes-facturacion')
  @ApiOperation({ summary: 'Crear fuente de facturación' })
  createFuenteFacturacion(
    @CurrentUser('idAeropuertoActivo') _idAeropuerto: number,
    @Body() dto: CreateFuenteFacturacionDto,
  ) {
    dto.idAeropuerto = _idAeropuerto;
    return this.facturacionService.createFuenteFacturacion(dto);
  }

  // ============================================================
  // CONFIGURACION FACTURACION
  // ============================================================

  @Get('configuracion-facturacion')
  @ApiOperation({ summary: 'Listar configuraciones de facturación' })
  findAllConfigFacturacion(@Query('idCliente') idCliente?: string, @Query('tipoFacturacion') tipoFacturacion?: string) {
    return this.facturacionService.findAllConfigFacturacion({ idCliente, tipoFacturacion });
  }

  // ============================================================
  // MOVIMIENTOS FACTURACION
  // ============================================================

  @Get('movimientos-facturacion')
  @ApiOperation({ summary: 'Listar movimientos de facturación' })
  findAllMovimientos(
    @Query('tipo') tipo?: string,
    @Query('idOperacion') idOperacion?: string,
    @Query('idFactura') idFactura?: string,
    @Query('facturado') facturado?: string,
  ) {
    return this.facturacionService.findAllMovimientos({ tipo, idOperacion, idFactura, facturado });
  }

  @Post('movimientos-facturacion')
  @ApiOperation({ summary: 'Crear movimiento de facturación' })
  createMovimiento(@Body() dto: CreateMovimientoFacturacionDto) {
    return this.facturacionService.createMovimiento(dto);
  }

  // ============================================================
  // FOLIOS
  // ============================================================

  @Get('folios')
  @ApiOperation({ summary: 'Listar folios' })
  findAllFolios(
    @CurrentUser('idAeropuertoActivo') _idAeropuerto: number,
    @Query('idAerolinea') idAerolinea?: string,
    @Query('estado') estado?: string,
  ) {
    return this.facturacionService.findAllFolios({ idAeropuerto: String(_idAeropuerto), idAerolinea, estado });
  }

  @Post('folios')
  @ApiOperation({ summary: 'Crear folio' })
  createFolio(
    @CurrentUser('idAeropuertoActivo') _idAeropuerto: number,
    @Body() dto: CreateFolioDto,
  ) {
    dto.idAeropuerto = _idAeropuerto;
    return this.facturacionService.createFolio(dto);
  }

  // ============================================================
  // FOLIOS DETALLE
  // ============================================================

  @Get('folios-detalle')
  @ApiOperation({ summary: 'Listar detalles de folio' })
  findAllFoliosDetalle(@Query('idFolio') idFolio?: string) {
    return this.facturacionService.findAllFoliosDetalle({ idFolio });
  }
}
