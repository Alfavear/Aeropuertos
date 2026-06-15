import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SecuenciaService } from '../secuencia/secuencia.service';

interface FacturarDto {
  idAerolinea: number;
  idAeropuerto: number;
  fuente: string;
  tipoFactura: number;
  descripcion?: string;
  idMoneda?: number;
  tasaCambio?: number;
  usuario: string;
  movimientos: number[];
}

@Injectable()
export class FacturacionEngineService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly secuenciaService: SecuenciaService,
  ) {}

  async facturarContado(dto: FacturarDto) {
    return this.facturar('CONTADO', dto);
  }

  async facturarCredito(dto: FacturarDto) {
    return this.facturar('CREDITO', dto);
  }

  private async facturar(tipo: 'CONTADO' | 'CREDITO', dto: FacturarDto) {
    const { idAerolinea, idAeropuerto, fuente, tipoFactura, descripcion, idMoneda, tasaCambio, usuario, movimientos: movimientoIds } = dto;

    return this.prisma.$transaction(async (tx) => {
      const movimientos = await tx.movimientoFacturacion.findMany({
        where: { id: { in: movimientoIds.map(BigInt) }, facturado: false, idAerolinea },
      });

      if (movimientos.length === 0) {
        throw new BadRequestException('Ninguno de los movimientos está disponible para facturar');
      }

      if (movimientos.length !== movimientoIds.length) {
        throw new BadRequestException('Algunos movimientos no están disponibles o ya fueron facturados');
      }

      const secNombre = tipo === 'CONTADO' ? 'FACT_CONTADO' : 'FACT_CREDITO';
      await this.secuenciaService.crearSiNoExiste(secNombre, idAeropuerto, 1);
      const { consecutivo } = await this.secuenciaService.obtenerSiguiente(secNombre, idAeropuerto);

      const aeropuerto = await tx.aeropuerto.findUnique({
        where: { id: idAeropuerto },
        select: { codigo: true },
      });

      const documento = `${fuente}${String(consecutivo).padStart(8, '0')}`;
      const bu = aeropuerto?.codigo ?? '';

      let total = 0;

      for (const m of movimientos) {
        total += Number(m.valor ?? 0);
      }

      const factura = await tx.factura.create({
        data: {
          fuente,
          documento,
          fecha: new Date(),
          idAerolinea,
          tipoFactura,
          descripcion: descripcion ?? null,
          idMoneda: idMoneda ?? null,
          totalNeto: total,
          totalIVA: 0,
          total,
          totalMoneda: tasaCambio ? total * tasaCambio : null,
          tasaCambio: tasaCambio ?? null,
          usuario,
          bu,
          estado: tipo === 'CONTADO' ? 'PG' : 'CC',
        },
      });

      for (const m of movimientos) {
        const concepto = m.idConcepto
          ? await tx.concepto.findUnique({ where: { id: m.idConcepto }, select: { nombre: true } })
          : null;

        await tx.facturaDetalle.create({
          data: {
            idFactura: factura.id,
            fuente,
            documento,
            idConcepto: m.idConcepto,
            descripcion: concepto?.nombre ?? null,
            cantidad: m.cantidad ?? 1,
            valorConcepto: m.valor ?? 0,
            total: m.valor ?? 0,
            totalMoneda: tasaCambio ? Number(m.valor ?? 0) * tasaCambio : null,
            tasaCambio: tasaCambio ?? null,
            bu,
          },
        });

        await tx.movimientoFacturacion.update({
          where: { id: m.id },
          data: { facturado: true, idFactura: factura.id },
        });
      }

      if (tipo === 'CONTADO') {
        await tx.facturaPago.create({
          data: {
            idFactura: factura.id,
            fuente,
            documento,
            tipoPago: 'CONT',
            total,
            totalMoneda: tasaCambio ? total * tasaCambio : null,
            tasaCambio: tasaCambio ?? null,
            bu,
          },
        });
      }

      return {
        id: factura.id.toString(),
        fuente,
        documento,
        total,
        estado: factura.estado,
        movimientosFacturados: movimientoIds.length,
      };
    });
  }

  async anularFactura(
    idFactura: bigint,
    motivo: string,
    _usuario: string,
    _idAeropuerto: number,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const factura = await tx.factura.findUnique({ where: { id: idFactura } });
      if (!factura) throw new NotFoundException('Factura no encontrada');
      if (factura.estado === 'AN') throw new BadRequestException('La factura ya está anulada');

      if (factura.estado === 'PG') {
        throw new BadRequestException(
          'No se puede anular una factura pagada. Debe realizar una nota contable.',
        );
      }

      await tx.movimientoFacturacion.updateMany({
        where: { idFactura },
        data: { facturado: false, idFactura: null },
      });

      await tx.factura.update({
        where: { id: idFactura },
        data: { estado: 'AN', descripcion: `${factura.descripcion ?? ''} [ANULADA: ${motivo}]` },
      });

      return { message: 'Factura anulada correctamente' };
    });
  }

  async crearNotaContable(
    dto: {
      tipo: 'DB' | 'CR';
      idFactura?: bigint;
      concepto: string;
      usuario: string;
      idAeropuerto: number;
      fuente: string;
    },
  ) {
    return this.prisma.$transaction(async (tx) => {
      const secNombre = dto.tipo === 'DB' ? 'NOTA_DEBITO' : 'NOTA_CREDITO';
      await this.secuenciaService.crearSiNoExiste(secNombre, dto.idAeropuerto, 1);
      const { consecutivo } = await this.secuenciaService.obtenerSiguiente(secNombre, dto.idAeropuerto);

      const aeropuerto = await tx.aeropuerto.findUnique({
        where: { id: dto.idAeropuerto },
        select: { codigo: true },
      });

      const documento = `${dto.fuente}${String(consecutivo).padStart(8, '0')}`;

      const nota = await tx.notaContable.create({
        data: {
          fuente: dto.fuente,
          documento,
          fecha: new Date(),
          concepto: dto.concepto,
          usuario: dto.usuario,
          bu: aeropuerto?.codigo ?? '',
          estado: dto.tipo === 'CR' ? 'AP' : 'PN',
        },
      });

      return nota;
    });
  }
}
