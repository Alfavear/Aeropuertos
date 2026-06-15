import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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

@Injectable()
export class FacturacionService {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================================
  // FACTURAS
  // ============================================================

  async findAllFacturas(query?: {
    idAerolinea?: string;
    fuente?: string;
    estado?: string;
    tipoFactura?: string;
  }) {
    const where: Record<string, unknown> = {};
    if (query?.idAerolinea !== undefined) where.idAerolinea = parseInt(query.idAerolinea, 10);
    if (query?.fuente !== undefined) where.fuente = query.fuente;
    if (query?.estado !== undefined) where.estado = query.estado;
    if (query?.tipoFactura !== undefined) where.tipoFactura = parseInt(query.tipoFactura, 10);
    return this.prisma.factura.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findFacturaById(id: bigint) {
    const record = await this.prisma.factura.findUnique({ where: { id: BigInt(id) } });
    if (!record) throw new NotFoundException('Factura no encontrada');
    return record;
  }

  async createFactura(dto: CreateFacturaDto) {
    if (dto.fuente && dto.documento) {
      const existente = await this.prisma.factura.findFirst({
        where: { fuente: dto.fuente, documento: dto.documento },
      });
      if (existente) {
        throw new BadRequestException(
          `Ya existe una factura con fuente ${dto.fuente} y documento ${dto.documento}`,
        );
      }
    }
    return this.prisma.factura.create({ data: dto as any });
  }

  async updateFactura(id: bigint, dto: UpdateFacturaDto) {
    await this.findFacturaById(id);
    if (dto.fuente && dto.documento) {
      const existente = await this.prisma.factura.findFirst({
        where: { fuente: dto.fuente, documento: dto.documento },
      });
      if (existente && String(existente.id) !== String(id)) {
        throw new BadRequestException(
          `Ya existe una factura con fuente ${dto.fuente} y documento ${dto.documento}`,
        );
      }
    }
    return this.prisma.factura.update({ where: { id: BigInt(id) }, data: dto as any });
  }

  async deleteFactura(id: bigint) {
    await this.findFacturaById(id);
    return this.prisma.factura.delete({ where: { id: BigInt(id) } });
  }

  // ============================================================
  // FACTURAS DETALLE
  // ============================================================

  async findAllFacturasDetalle(query?: { idFactura?: string; idConcepto?: string }) {
    const where: Record<string, unknown> = {};
    if (query?.idFactura !== undefined) where.idFactura = BigInt(query.idFactura);
    if (query?.idConcepto !== undefined) where.idConcepto = parseInt(query.idConcepto, 10);
    return this.prisma.facturaDetalle.findMany({
      where,
      orderBy: { id: 'asc' },
    });
  }

  async findFacturaDetalleById(id: bigint) {
    const record = await this.prisma.facturaDetalle.findUnique({ where: { id: BigInt(id) } });
    if (!record) throw new NotFoundException('Detalle de factura no encontrado');
    return record;
  }

  async createFacturaDetalle(dto: CreateFacturaDetalleDto) {
    return this.prisma.facturaDetalle.create({ data: dto as any });
  }

  async updateFacturaDetalle(id: bigint, dto: UpdateFacturaDetalleDto) {
    await this.findFacturaDetalleById(id);
    return this.prisma.facturaDetalle.update({ where: { id: BigInt(id) }, data: dto as any });
  }

  async deleteFacturaDetalle(id: bigint) {
    await this.findFacturaDetalleById(id);
    return this.prisma.facturaDetalle.delete({ where: { id: BigInt(id) } });
  }

  // ============================================================
  // FACTURAS PAGOS
  // ============================================================

  async findAllFacturasPagos(query?: { idFactura?: string; tipoPago?: string }) {
    const where: Record<string, unknown> = {};
    if (query?.idFactura !== undefined) where.idFactura = BigInt(query.idFactura);
    if (query?.tipoPago !== undefined) where.tipoPago = query.tipoPago;
    return this.prisma.facturaPago.findMany({
      where,
      orderBy: { id: 'asc' },
    });
  }

  async findFacturaPagoById(id: bigint) {
    const record = await this.prisma.facturaPago.findUnique({ where: { id: BigInt(id) } });
    if (!record) throw new NotFoundException('Pago de factura no encontrado');
    return record;
  }

  async createFacturaPago(dto: CreateFacturaPagoDto) {
    return this.prisma.facturaPago.create({ data: dto as any });
  }

  async updateFacturaPago(id: bigint, dto: UpdateFacturaPagoDto) {
    await this.findFacturaPagoById(id);
    return this.prisma.facturaPago.update({ where: { id: BigInt(id) }, data: dto as any });
  }

  async deleteFacturaPago(id: bigint) {
    await this.findFacturaPagoById(id);
    return this.prisma.facturaPago.delete({ where: { id: BigInt(id) } });
  }

  // ============================================================
  // FACTURAS IMPUESTOS
  // ============================================================

  async findAllFacturasImpuestos(query?: { idFactura?: string }) {
    const where: Record<string, unknown> = {};
    if (query?.idFactura !== undefined) where.idFactura = BigInt(query.idFactura);
    return this.prisma.facturaImpuesto.findMany({
      where,
      orderBy: { id: 'asc' },
    });
  }

  async findFacturaImpuestoById(id: number) {
    const record = await this.prisma.facturaImpuesto.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('Impuesto de factura no encontrado');
    return record;
  }

  async createFacturaImpuesto(dto: CreateFacturaImpuestoDto) {
    return this.prisma.facturaImpuesto.create({ data: dto as any });
  }

  async updateFacturaImpuesto(id: number, dto: UpdateFacturaImpuestoDto) {
    await this.findFacturaImpuestoById(id);
    return this.prisma.facturaImpuesto.update({ where: { id }, data: dto as any });
  }

  async deleteFacturaImpuesto(id: number) {
    await this.findFacturaImpuestoById(id);
    return this.prisma.facturaImpuesto.delete({ where: { id } });
  }

  // ============================================================
  // NOTAS CONTABLES
  // ============================================================

  async findAllNotasContables(query?: { estado?: string; fuente?: string }) {
    const where: Record<string, unknown> = {};
    if (query?.estado !== undefined) where.estado = query.estado;
    if (query?.fuente !== undefined) where.fuente = query.fuente;
    return this.prisma.notaContable.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findNotaContableById(id: bigint) {
    const record = await this.prisma.notaContable.findUnique({ where: { id: BigInt(id) } });
    if (!record) throw new NotFoundException('Nota contable no encontrada');
    return record;
  }

  async createNotaContable(dto: CreateNotaContableDto) {
    return this.prisma.notaContable.create({ data: dto as any });
  }

  async updateNotaContable(id: bigint, dto: UpdateNotaContableDto) {
    await this.findNotaContableById(id);
    return this.prisma.notaContable.update({ where: { id: BigInt(id) }, data: dto as any });
  }

  async deleteNotaContable(id: bigint) {
    await this.findNotaContableById(id);
    return this.prisma.notaContable.delete({ where: { id: BigInt(id) } });
  }

  // ============================================================
  // ACUERDOS PAGO
  // ============================================================

  async findAllAcuerdosPago(query?: { codAerolinea?: string; estado?: string }) {
    const where: Record<string, unknown> = {};
    if (query?.codAerolinea !== undefined) where.codAerolinea = query.codAerolinea;
    if (query?.estado !== undefined) where.estado = query.estado;
    return this.prisma.acuerdoPago.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAcuerdoPagoById(id: number) {
    const record = await this.prisma.acuerdoPago.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('Acuerdo de pago no encontrado');
    return record;
  }

  async createAcuerdoPago(dto: CreateAcuerdoPagoDto) {
    return this.prisma.acuerdoPago.create({ data: dto as any });
  }

  async updateAcuerdoPago(id: number, dto: UpdateAcuerdoPagoDto) {
    await this.findAcuerdoPagoById(id);
    return this.prisma.acuerdoPago.update({ where: { id }, data: dto as any });
  }

  async deleteAcuerdoPago(id: number) {
    await this.findAcuerdoPagoById(id);
    return this.prisma.acuerdoPago.delete({ where: { id } });
  }

  // ============================================================
  // FUENTES FACTURACION
  // ============================================================

  async findAllFuentesFacturacion(query?: { idAeropuerto?: string }) {
    const where: Record<string, unknown> = {};
    if (query?.idAeropuerto !== undefined) where.idAeropuerto = parseInt(query.idAeropuerto, 10);
    return this.prisma.fuenteFacturacion.findMany({
      where,
      orderBy: { id: 'asc' },
    });
  }

  async findFuenteFacturacionById(id: number) {
    const record = await this.prisma.fuenteFacturacion.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('Fuente de facturación no encontrada');
    return record;
  }

  async createFuenteFacturacion(dto: CreateFuenteFacturacionDto) {
    const aeropuerto = await this.prisma.aeropuerto.findUnique({
      where: { id: dto.idAeropuerto },
    });
    if (!aeropuerto) throw new BadRequestException('El aeropuerto especificado no existe');
    return this.prisma.fuenteFacturacion.create({ data: dto as any });
  }

  async updateFuenteFacturacion(id: number, dto: UpdateFuenteFacturacionDto) {
    await this.findFuenteFacturacionById(id);
    if (dto.idAeropuerto !== undefined) {
      const aeropuerto = await this.prisma.aeropuerto.findUnique({
        where: { id: dto.idAeropuerto },
      });
      if (!aeropuerto) throw new BadRequestException('El aeropuerto especificado no existe');
    }
    return this.prisma.fuenteFacturacion.update({ where: { id }, data: dto as any });
  }

  async deleteFuenteFacturacion(id: number) {
    await this.findFuenteFacturacionById(id);
    return this.prisma.fuenteFacturacion.delete({ where: { id } });
  }

  // ============================================================
  // CONFIGURACION FACTURACION
  // ============================================================

  async findAllConfigFacturacion(query?: { idCliente?: string; tipoFacturacion?: string }) {
    const where: Record<string, unknown> = {};
    if (query?.idCliente !== undefined) where.idCliente = query.idCliente;
    if (query?.tipoFacturacion !== undefined) where.tipoFacturacion = query.tipoFacturacion;
    return this.prisma.configFacturacion.findMany({
      where,
      orderBy: { id: 'asc' },
    });
  }

  async findConfigFacturacionById(id: number) {
    const record = await this.prisma.configFacturacion.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('Configuración de facturación no encontrada');
    return record;
  }

  async createConfigFacturacion(dto: CreateConfigFacturacionDto) {
    return this.prisma.configFacturacion.create({ data: dto as any });
  }

  async updateConfigFacturacion(id: number, dto: UpdateConfigFacturacionDto) {
    await this.findConfigFacturacionById(id);
    return this.prisma.configFacturacion.update({ where: { id }, data: dto as any });
  }

  async deleteConfigFacturacion(id: number) {
    await this.findConfigFacturacionById(id);
    return this.prisma.configFacturacion.delete({ where: { id } });
  }

  // ============================================================
  // MOVIMIENTOS FACTURACION
  // ============================================================

  async findAllMovimientos(query?: {
    tipo?: string;
    idOperacion?: string;
    idFactura?: string;
    facturado?: string;
  }) {
    const where: Record<string, unknown> = {};
    if (query?.tipo !== undefined) where.tipo = query.tipo;
    if (query?.idOperacion !== undefined) where.idOperacion = parseInt(query.idOperacion, 10);
    if (query?.idFactura !== undefined) where.idFactura = BigInt(query.idFactura);
    if (query?.facturado !== undefined) where.facturado = query.facturado === 'true';
    return this.prisma.movimientoFacturacion.findMany({
      where,
      orderBy: { fecha: 'desc' },
    });
  }

  async findMovimientoById(id: number) {
    const record = await this.prisma.movimientoFacturacion.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('Movimiento de facturación no encontrado');
    return record;
  }

  async createMovimiento(dto: CreateMovimientoFacturacionDto) {
    return this.prisma.movimientoFacturacion.create({ data: dto as any });
  }

  async updateMovimiento(id: number, dto: UpdateMovimientoFacturacionDto) {
    await this.findMovimientoById(id);
    return this.prisma.movimientoFacturacion.update({ where: { id }, data: dto as any });
  }

  async deleteMovimiento(id: number) {
    await this.findMovimientoById(id);
    return this.prisma.movimientoFacturacion.delete({ where: { id } });
  }

  // ============================================================
  // FOLIOS
  // ============================================================

  async findAllFolios(query?: { idAeropuerto?: string; idAerolinea?: string; estado?: string }) {
    const where: Record<string, unknown> = {};
    if (query?.idAeropuerto !== undefined) where.idAeropuerto = parseInt(query.idAeropuerto, 10);
    if (query?.idAerolinea !== undefined) where.idAerolinea = parseInt(query.idAerolinea, 10);
    if (query?.estado !== undefined) where.estado = parseInt(query.estado, 10);
    return this.prisma.folio.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findFolioById(id: number) {
    const record = await this.prisma.folio.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('Folio no encontrado');
    return record;
  }

  async createFolio(dto: CreateFolioDto) {
    return this.prisma.folio.create({ data: dto as any });
  }

  async updateFolio(id: number, dto: UpdateFolioDto) {
    await this.findFolioById(id);
    return this.prisma.folio.update({ where: { id }, data: dto as any });
  }

  async deleteFolio(id: number) {
    await this.findFolioById(id);
    return this.prisma.folio.delete({ where: { id } });
  }

  // ============================================================
  // FOLIOS DETALLE
  // ============================================================

  async findAllFoliosDetalle(query?: { idFolio?: string }) {
    const where: Record<string, unknown> = {};
    if (query?.idFolio !== undefined) where.idFolio = parseInt(query.idFolio, 10);
    return this.prisma.folioDetalle.findMany({
      where,
      orderBy: { id: 'asc' },
    });
  }

  async findFolioDetalleById(id: number) {
    const record = await this.prisma.folioDetalle.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('Detalle de folio no encontrado');
    return record;
  }

  async createFolioDetalle(dto: CreateFolioDetalleDto) {
    return this.prisma.folioDetalle.create({ data: dto as any });
  }

  async updateFolioDetalle(id: number, dto: UpdateFolioDetalleDto) {
    await this.findFolioDetalleById(id);
    return this.prisma.folioDetalle.update({ where: { id }, data: dto as any });
  }

  async deleteFolioDetalle(id: number) {
    await this.findFolioDetalleById(id);
    return this.prisma.folioDetalle.delete({ where: { id } });
  }
}
