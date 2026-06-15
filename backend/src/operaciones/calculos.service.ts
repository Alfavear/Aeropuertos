import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CalcularConceptosDto } from './dto/calcular-conceptos.dto';
import { ResultadoCalculoDto, ConceptoCalculadoDto } from './dto/resultado-calculo.dto';

@Injectable()
export class CalculosService {
  private readonly logger = new Logger(CalculosService.name);

  constructor(private readonly prisma: PrismaService) {}

  async calcularConceptos(dto: CalcularConceptosDto): Promise<ResultadoCalculoDto> {
    const fecha = new Date(dto.fecha);

    const [aerolinea, tarifasOperacion, tarifasAerolinea, trm, ipc, params] = await Promise.all([
      this.prisma.aerolinea.findUnique({ where: { id: dto.idAerolinea } }),
      this.prisma.tarifaOperacion.findMany({
        where: { idAeropuerto: dto.idAeropuerto },
      }),
      this.prisma.tarifaAerolinea.findMany({
        where: { idAerolinea: dto.idAerolinea },
      }),
      this.prisma.indicadorEconomico.findFirst({
        where: { codigo: 'TRM', fecha: { lte: fecha } },
        orderBy: { fecha: 'desc' },
      }),
      this.prisma.indicadorEconomico.findFirst({
        where: { codigo: 'IPC', fecha: { lte: fecha } },
        orderBy: { fecha: 'desc' },
      }),
      this.prisma.parametroSistema.findMany({
        where: { modulo: 'Operaciones' },
      }),
    ]);

    if (!aerolinea) {
      throw new BadRequestException('Aerolínea no encontrada');
    }

    const redondeoPesos = this.getParamNumber(params, 'REDONDEO_PESOS', 0);
    const calcNalFromIntIfZero = this.getParamNumber(params, 'CALC_NAL_FROM_INT_IF_ZERO', 1);
    const aplicarIPC = this.getParamNumber(params, 'APLICAR_IPC_TARIFAS', 0) === 1;
    const tasaTRM = Number(trm?.valor ?? 0);
    const ipcValor = Number(ipc?.valor ?? 0);

    const ctx: CtxParams = {
      aerolinea,
      redondeoPesos,
      calcNalFromIntIfZero,
      tasaTRM,
      aplicarIPC,
      ipcValor,
      params,
      tarifasOperacion,
      tarifasAerolinea,
    };

    const [tiposOperacion, conceptos] = await Promise.all([
      this.prisma.tipoOperacion.findMany(),
      this.prisma.concepto.findMany({ where: { activo: true } }),
    ]);

    const conceptosCalculados: ConceptoCalculadoDto[] = [];

    for (const tipo of dto.conceptos) {
      switch (tipo.toUpperCase()) {
        case 'ATERRIZAJE': {
          const res = await this.calcularAterrizaje(dto, tiposOperacion, conceptos, ctx);
          conceptosCalculados.push(...res);
          break;
        }
        case 'PARQUEO': {
          const res = await this.calcularParqueo(dto, tiposOperacion, conceptos, ctx);
          conceptosCalculados.push(...res);
          break;
        }
        case 'TASA': {
          const res = await this.calcularTasas(dto, tiposOperacion, conceptos, ctx);
          conceptosCalculados.push(...res);
          break;
        }
        case 'SERVICIO': {
          const res = await this.calcularServicio(dto, conceptos, ctx);
          conceptosCalculados.push(...res);
          break;
        }
        default:
          throw new BadRequestException(`Tipo de concepto no soportado: ${tipo}`);
      }
    }

    const totalCOP = conceptosCalculados
      .filter(c => c.moneda === 'COP')
      .reduce((s, c) => s + c.valor, 0);
    const totalUSD = conceptosCalculados
      .filter(c => c.moneda === 'USD')
      .reduce((s, c) => s + c.valor, 0);

    return {
      exito: true,
      idAerolinea: dto.idAerolinea,
      idAeropuerto: dto.idAeropuerto,
      fecha: dto.fecha,
      nacionalidad: dto.nacionalidad,
      peso: dto.peso,
      conceptos: conceptosCalculados,
      totalCOP,
      totalUSD,
    };
  }

  private calcularAterrizaje(
    dto: CalcularConceptosDto,
    tiposOperacion: any[],
    conceptos: any[],
    ctx: CtxParams,
  ): ConceptoCalculadoDto[] {
    const resultados: ConceptoCalculadoDto[] = [];
    const tipos = tiposOperacion.filter(t => t.tipoTarifa === 3);

    for (const tipo of tipos) {
      const concepto = conceptos.find(c => c.id === tipo.idConcepto);
      if (!concepto) continue;

      const tarifa = this.buscarTarifaAplicable(
        ctx.tarifasOperacion, ctx.tarifasAerolinea, tipo.id, dto.nacionalidad, dto.peso,
      );
      if (!tarifa) continue;

      const { tarifaBase, tarifaAplicada, monedaTarifa } = tarifa;
      const tarifaIndexada = ctx.aplicarIPC ? this.aplicarIndexacion(tarifaAplicada, ctx.ipcValor) : tarifaAplicada;

      const peso = dto.peso ?? 1;
      const valorBruto = tarifaIndexada * peso;
      const valorRedondeado = this.redondear(valorBruto, ctx.redondeoPesos);

      let valorFinal = valorRedondeado;
      let moneda = monedaTarifa;

      if (dto.nacionalidad === 'I') {
        const conv = this.fnCalcTarifLocalForInt(
          valorRedondeado, tarifaIndexada,
          ctx.tasaTRM, dto.monedaPago ?? 0, ctx.calcNalFromIntIfZero, ctx.redondeoPesos,
        );
        valorFinal = conv.valor;
        moneda = conv.moneda;
      }

      resultados.push({
        idConcepto: concepto.id,
        codigo: concepto.codigo,
        nombre: concepto.nombre,
        tipo: 'ATERRIZAJE',
        valor: valorFinal,
        tarifa: tarifaBase,
        cantidad: peso,
        moneda,
        formula: `Aterrizaje: ${concepto.nombre} | Tarifa ${tarifaBase.toFixed(6)} x ${peso}kg = ${moneda} ${valorFinal.toFixed(2)}`,
      });
    }

    return resultados;
  }

  private calcularParqueo(
    dto: CalcularConceptosDto,
    tiposOperacion: any[],
    conceptos: any[],
    ctx: CtxParams,
  ): ConceptoCalculadoDto[] {
    if (!dto.horaLlegada || !dto.horaSalida) {
      throw new BadRequestException('Se requieren horaLlegada y horaSalida para calcular parqueo');
    }

    const resultados: ConceptoCalculadoDto[] = [];
    const tipos = tiposOperacion.filter(t => t.tipoTarifa === 4);

    const llegada = new Date(dto.horaLlegada);
    const salida = new Date(dto.horaSalida);
    const diffMs = salida.getTime() - llegada.getTime();
    const horasTotales = Math.max(0, diffMs / (1000 * 60 * 60));
    const horasGracia = Number(ctx.aerolinea.horasGraciaParqueo ?? 0);
    const porRecargoNocturno = Number(ctx.aerolinea.porRecargoNocturno ?? 0);

    for (const tipo of tipos) {
      const concepto = conceptos.find(c => c.id === tipo.idConcepto);
      if (!concepto) continue;

      const tarifa = this.buscarTarifaAplicable(
        ctx.tarifasOperacion, ctx.tarifasAerolinea, tipo.id, 'N', dto.peso,
      );
      if (!tarifa) continue;

      let tarifaBase = tarifa.tarifaAplicada;
      if (ctx.aplicarIPC) {
        tarifaBase = this.aplicarIndexacion(tarifaBase, ctx.ipcValor);
      }

      let horasFacturables = horasTotales;
      if (horasGracia > 0) {
        horasFacturables = Math.max(0, horasTotales - horasGracia);
      }

      let valorBase = tarifaBase * horasFacturables;
      let valorRecargoNoc = 0;

      if (porRecargoNocturno > 0) {
        const horasNocturnas = this.calcularHorasNocturnas(llegada, salida);
        valorRecargoNoc = tarifaBase * (porRecargoNocturno / 100) * Math.floor(horasNocturnas);
      }

      const valorTotal = this.redondear(valorBase + valorRecargoNoc, ctx.redondeoPesos);

      resultados.push({
        idConcepto: concepto.id,
        codigo: concepto.codigo,
        nombre: concepto.nombre,
        tipo: 'PARQUEO',
        valor: valorTotal,
        tarifa: tarifaBase,
        cantidad: horasFacturables,
        moneda: 'COP',
        formula: `Parqueo: ${horasFacturables.toFixed(2)}h x ${tarifaBase.toFixed(2)} = ${valorBase.toFixed(2)}`
          + (valorRecargoNoc > 0 ? ` + recargoNocturno ${valorRecargoNoc.toFixed(2)}` : '')
          + (horasGracia > 0 ? ` (${horasGracia}h gracia)` : ''),
      });
    }

    return resultados;
  }

  private calcularTasas(
    dto: CalcularConceptosDto,
    tiposOperacion: any[],
    conceptos: any[],
    ctx: CtxParams,
  ): ConceptoCalculadoDto[] {
    const resultados: ConceptoCalculadoDto[] = [];
    const tipos = tiposOperacion.filter(t => t.tipoTarifa === 5);

    for (const tipo of tipos) {
      const concepto = conceptos.find(c => c.id === tipo.idConcepto);
      if (!concepto) continue;

      const tarifaLoc = this.buscarTarifaAplicable(
        ctx.tarifasOperacion, ctx.tarifasAerolinea, tipo.id, 'N',
      );
      const tarifaExt = this.buscarTarifaAplicable(
        ctx.tarifasOperacion, ctx.tarifasAerolinea, tipo.id, 'I',
      );

      if (!tarifaLoc) continue;

      const tarifaLocVal = ctx.aplicarIPC
        ? this.aplicarIndexacion(tarifaLoc.tarifaAplicada, ctx.ipcValor)
        : tarifaLoc.tarifaAplicada;
      const tarifaExtVal = tarifaExt
        ? (ctx.aplicarIPC
          ? this.aplicarIndexacion(tarifaExt.tarifaAplicada, ctx.ipcValor)
          : tarifaExt.tarifaAplicada)
        : tarifaLocVal;

      if (dto.nacionalidad === 'N') {
        const totalPagan = dto.totalPaganTasa ?? 0;
        if (totalPagan > 0) {
          const valor = this.redondear(tarifaLocVal * totalPagan, ctx.redondeoPesos);
          resultados.push({
            idConcepto: concepto.id,
            codigo: concepto.codigo,
            nombre: concepto.nombre,
            tipo: 'TASA',
            valor,
            tarifa: tarifaLocVal,
            cantidad: totalPagan,
            moneda: 'COP',
            formula: `Tasa Nal: ${tarifaLocVal.toFixed(2)} x ${totalPagan} pax = COP ${valor.toFixed(2)}`,
          });
        }
      } else {
        const conv = this.fnCalcTarifLocalForInt(
          tarifaLocVal, tarifaExtVal,
          ctx.tasaTRM, dto.monedaPago ?? 0, ctx.calcNalFromIntIfZero, ctx.redondeoPesos,
        );

        const paxPesos = dto.pasajerosPesos ?? 0;
        const paxDolares = dto.pasajerosDolares ?? 0;

        if (paxPesos > 0) {
          const valor = this.redondear(conv.valor * paxPesos, ctx.redondeoPesos);
          resultados.push({
            idConcepto: concepto.id,
            codigo: concepto.codigo,
            nombre: concepto.nombre,
            tipo: 'TASA',
            valor,
            tarifa: conv.valor,
            cantidad: paxPesos,
            moneda: conv.moneda,
            formula: `Tasa Int Pesos: ${conv.valor.toFixed(2)} x ${paxPesos} pax = ${conv.moneda} ${valor.toFixed(2)}`,
          });
        }
        if (paxDolares > 0) {
          const valor = this.redondear(tarifaExtVal * paxDolares, ctx.redondeoPesos);
          resultados.push({
            idConcepto: concepto.id,
            codigo: concepto.codigo,
            nombre: concepto.nombre,
            tipo: 'TASA',
            valor,
            tarifa: tarifaExtVal,
            cantidad: paxDolares,
            moneda: 'USD',
            formula: `Tasa Int USD: ${tarifaExtVal.toFixed(2)} x ${paxDolares} pax = USD ${valor.toFixed(2)}`,
          });
        }
      }
    }

    return resultados;
  }

  private calcularServicio(
    dto: CalcularConceptosDto,
    conceptos: any[],
    ctx: CtxParams,
  ): ConceptoCalculadoDto[] {
    const concepto = conceptos.find(c => c.codigo === 'SERVICIO');
    if (!concepto) return [];

    const cantidad = dto.cantidad ?? 1;
    const valorUnitario = Number(concepto.valorUnitario ?? 0);
    const valor = this.redondear(valorUnitario * cantidad, ctx.redondeoPesos);

    return [{
      idConcepto: concepto.id,
      codigo: concepto.codigo,
      nombre: concepto.nombre,
      tipo: 'SERVICIO',
      valor,
      tarifa: valorUnitario,
      cantidad,
      moneda: 'COP',
      formula: `Servicio: ${valorUnitario.toFixed(2)} x ${cantidad} = COP ${valor.toFixed(2)}`,
    }];
  }

  // ============================================================
  // HELPERS: Tarifa Indexada (FnGetTarifaIndexada equivalente)
  // ============================================================

  private buscarTarifaAplicable(
    tarifasOperacion: any[],
    tarifasAerolinea: any[],
    idTipoOperacion: number,
    nacionalidad: string,
    peso?: number,
  ): { tarifaBase: number; tarifaAplicada: number; monedaTarifa: string } | null {
    const candidatas = tarifasOperacion.filter((t: any) => t.idTipoOperacion === idTipoOperacion);
    if (candidatas.length === 0) return null;

    let tarifaSel: any;
    if (candidatas.length === 1) {
      tarifaSel = candidatas[0];
    } else if (peso !== undefined) {
      tarifaSel = candidatas.find((t: any) =>
        t.rango === 'S'
        && peso >= Number(t.rangoInicial ?? 0)
        && peso <= Number(t.rangoFinal ?? Infinity),
      ) ?? candidatas[0];
    } else {
      tarifaSel = candidatas[0];
    }

    const tarifaKiloLocal = Number(tarifaSel.tarifaKiloLocal);
    const tarifaKiloExt = Number(tarifaSel.tarifaKiloExtranjero);

    const tarifaNegociada = tarifasAerolinea.find(
      (ta: any) => ta.idTarifaOperacion === tarifaSel.id,
    );

    const tarifaBase = nacionalidad === 'N'
      ? (tarifaNegociada ? Number(tarifaNegociada.tarifaKiloLocal) : tarifaKiloLocal)
      : (tarifaNegociada ? Number(tarifaNegociada.tarifaKiloExtranjero) : tarifaKiloExt);

    return { tarifaBase, tarifaAplicada: tarifaBase, monedaTarifa: 'COP' };
  }

  private aplicarIndexacion(tarifa: number, ipcValor: number): number {
    if (ipcValor <= 0) return tarifa;
    return tarifa * (1 + ipcValor / 100);
  }

  private fnCalcTarifLocalForInt(
    tarifaLocal: number,
    tarifaExtranjera: number,
    tasaTRM: number,
    monedaPago: number,
    calcNalFromIntIfZero: number,
    precision: number,
  ): { valor: number; moneda: string } {
    if (monedaPago === 1) {
      return { valor: this.redondear(tarifaExtranjera, precision), moneda: 'USD' };
    }
    if (tarifaLocal === 0 && calcNalFromIntIfZero === 1 && tasaTRM > 0) {
      return { valor: this.redondear(tarifaExtranjera * tasaTRM, precision), moneda: 'COP' };
    }
    return { valor: this.redondear(tarifaLocal, precision), moneda: 'COP' };
  }

  // ============================================================
  // HELPERS: Parqueo — horas nocturnas (18:00–06:00)
  // ============================================================

  private calcularHorasNocturnas(llegada: Date, salida: Date): number {
    const NOCHE_INI = 18;
    const NOCHE_FIN = 6;
    let total = 0;
    const current = new Date(llegada);
    while (current < salida) {
      const h = current.getHours();
      if (h >= NOCHE_INI || h < NOCHE_FIN) total += 1;
      current.setHours(current.getHours() + 1, 0, 0, 0);
    }
    return total;
  }

  // ============================================================
  // HELPERS: Generales
  // ============================================================

  private redondear(valor: number, decimales: number): number {
    const factor = Math.pow(10, decimales);
    return Math.round(valor * factor) / factor;
  }

  private getParamNumber(params: any[], codigo: string, defaultValue: number): number {
    const p = params.find((x: any) => x.codigo === codigo);
    return p ? parseFloat(p.valor) ?? defaultValue : defaultValue;
  }
}

interface CtxParams {
  aerolinea: any;
  redondeoPesos: number;
  calcNalFromIntIfZero: number;
  tasaTRM: number;
  aplicarIPC: boolean;
  ipcValor: number;
  params: any[];
  tarifasOperacion: any[];
  tarifasAerolinea: any[];
}
