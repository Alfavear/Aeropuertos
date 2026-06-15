import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePeriodoDto } from './dto/create-periodo.dto';
import { UpdatePeriodoDto } from './dto/update-periodo.dto';
import { CreatePeriodoAeropuertoDto } from './dto/create-periodo-aeropuerto.dto';
import { UpdatePeriodoAeropuertoDto } from './dto/update-periodo-aeropuerto.dto';
import { CreateDiaAeropuertoDto } from './dto/create-dia-aeropuerto.dto';
import { UpdateDiaAeropuertoDto } from './dto/update-dia-aeropuerto.dto';
import { CreateDiaFeriadoDto } from './dto/create-dia-feriado.dto';
import { UpdateDiaFeriadoDto } from './dto/update-dia-feriado.dto';
import { VerificarFeriadoDto } from './dto/verificar-feriado.dto';

@Injectable()
export class PeriodosService {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================================
  // PERIODOS
  // ============================================================

  async findAllPeriodos(estado?: string) {
    const where: Record<string, unknown> = {};
    if (estado) where.estado = estado;
    return this.prisma.periodo.findMany({ where, orderBy: { id: 'asc' } });
  }

  async findOnePeriodo(id: number) {
    const periodo = await this.prisma.periodo.findUnique({ where: { id } });
    if (!periodo) throw new NotFoundException('Período no encontrado');
    return periodo;
  }

  async createPeriodo(dto: CreatePeriodoDto) {
    const existente = await this.prisma.periodo.findFirst({
      where: { codigo: dto.codigo },
    });
    if (existente) {
      throw new BadRequestException(`Ya existe un período con el código ${dto.codigo}`);
    }

    if (dto.fechaIni && dto.fechaFin && new Date(dto.fechaIni) >= new Date(dto.fechaFin)) {
      throw new BadRequestException('fechaIni debe ser menor que fechaFin');
    }

    return this.prisma.periodo.create({
      data: {
        codigo: dto.codigo,
        fechaIni: dto.fechaIni ? new Date(dto.fechaIni) : undefined,
        fechaFin: dto.fechaFin ? new Date(dto.fechaFin) : undefined,
        estado: dto.estado ?? 'A',
        usuario: dto.usuario,
        fechaCierre: dto.fechaCierre ? new Date(dto.fechaCierre) : undefined,
      },
    });
  }

  async updatePeriodo(id: number, dto: UpdatePeriodoDto) {
    const periodo = await this.findOnePeriodo(id);

    if (dto.codigo) {
      const existente = await this.prisma.periodo.findFirst({
        where: { codigo: dto.codigo },
      });
      if (existente && existente.id !== id) {
        throw new BadRequestException(`Ya existe un período con el código ${dto.codigo}`);
      }
    }

    const fechaIni = dto.fechaIni ? new Date(dto.fechaIni) : periodo.fechaIni;
    const fechaFin = dto.fechaFin ? new Date(dto.fechaFin) : periodo.fechaFin;
    if (fechaIni && fechaFin && fechaIni >= fechaFin) {
      throw new BadRequestException('fechaIni debe ser menor que fechaFin');
    }

    return this.prisma.periodo.update({
      where: { id },
      data: {
        ...dto,
        fechaIni: dto.fechaIni ? new Date(dto.fechaIni) : undefined,
        fechaFin: dto.fechaFin ? new Date(dto.fechaFin) : undefined,
        fechaCierre: dto.fechaCierre ? new Date(dto.fechaCierre) : undefined,
      },
    });
  }

  async removePeriodo(id: number) {
    await this.findOnePeriodo(id);

    const count = await this.prisma.periodoAeropuerto.count({
      where: { idPeriodo: id },
    });
    if (count > 0) {
      throw new BadRequestException(
        'No se puede eliminar el período porque tiene aeropuertos asociados',
      );
    }

    return this.prisma.periodo.delete({ where: { id } });
  }

  // ============================================================
  // PERIODOS AEROPUERTO
  // ============================================================

  async findAllPeriodosAeropuerto(filtros?: {
    idAeropuerto?: number;
    idPeriodo?: number;
    abierto?: string;
  }) {
    const where: Record<string, unknown> = {};
    if (filtros?.idAeropuerto !== undefined) where.idAeropuerto = filtros.idAeropuerto;
    if (filtros?.idPeriodo !== undefined) where.idPeriodo = filtros.idPeriodo;
    if (filtros?.abierto !== undefined) where.abierto = filtros.abierto;
    return this.prisma.periodoAeropuerto.findMany({ where, orderBy: { idAeropuerto: 'asc' } });
  }

  async findOnePeriodoAeropuerto(idAeropuerto: number, idPeriodo: number) {
    const pa = await this.prisma.periodoAeropuerto.findUnique({
      where: { idAeropuerto_idPeriodo: { idAeropuerto, idPeriodo } },
    });
    if (!pa) throw new NotFoundException('Período de aeropuerto no encontrado');
    return pa;
  }

  async createPeriodoAeropuerto(dto: CreatePeriodoAeropuertoDto) {
    const aeropuerto = await this.prisma.aeropuerto.findUnique({
      where: { id: dto.idAeropuerto },
    });
    if (!aeropuerto) throw new BadRequestException('El aeropuerto especificado no existe');

    const periodo = await this.prisma.periodo.findUnique({
      where: { id: dto.idPeriodo },
    });
    if (!periodo) throw new BadRequestException('El período especificado no existe');

    const existente = await this.prisma.periodoAeropuerto.findUnique({
      where: { idAeropuerto_idPeriodo: { idAeropuerto: dto.idAeropuerto, idPeriodo: dto.idPeriodo } },
    });
    if (existente) {
      throw new BadRequestException('La relación aeropuerto-período ya existe');
    }

    return this.prisma.periodoAeropuerto.create({
      data: {
        idAeropuerto: dto.idAeropuerto,
        idPeriodo: dto.idPeriodo,
        abierto: dto.abierto ?? 'S',
      },
    });
  }

  async updatePeriodoAeropuerto(
    idAeropuerto: number,
    idPeriodo: number,
    dto: UpdatePeriodoAeropuertoDto,
  ) {
    await this.findOnePeriodoAeropuerto(idAeropuerto, idPeriodo);
    return this.prisma.periodoAeropuerto.update({
      where: { idAeropuerto_idPeriodo: { idAeropuerto, idPeriodo } },
      data: dto,
    });
  }

  async removePeriodoAeropuerto(idAeropuerto: number, idPeriodo: number) {
    await this.findOnePeriodoAeropuerto(idAeropuerto, idPeriodo);
    return this.prisma.periodoAeropuerto.delete({
      where: { idAeropuerto_idPeriodo: { idAeropuerto, idPeriodo } },
    });
  }

  async abrirPeriodoAeropuerto(idAeropuerto: number, idPeriodo: number) {
    await this.findOnePeriodoAeropuerto(idAeropuerto, idPeriodo);
    return this.prisma.periodoAeropuerto.update({
      where: { idAeropuerto_idPeriodo: { idAeropuerto, idPeriodo } },
      data: { abierto: 'S' },
    });
  }

  async cerrarPeriodoAeropuerto(idAeropuerto: number, idPeriodo: number) {
    await this.findOnePeriodoAeropuerto(idAeropuerto, idPeriodo);
    return this.prisma.periodoAeropuerto.update({
      where: { idAeropuerto_idPeriodo: { idAeropuerto, idPeriodo } },
      data: { abierto: 'N' },
    });
  }

  // ============================================================
  // DIAS AEROPUERTO
  // ============================================================

  async findAllDiasAeropuerto(filtros?: {
    idPeriodo?: number;
    idAeropuerto?: number;
    abierto?: string;
  }) {
    const where: Record<string, unknown> = {};
    if (filtros?.idPeriodo !== undefined) where.idPeriodo = filtros.idPeriodo;
    if (filtros?.idAeropuerto !== undefined) where.idAeropuerto = filtros.idAeropuerto;
    if (filtros?.abierto !== undefined) where.abierto = filtros.abierto;
    return this.prisma.diaAeropuerto.findMany({ where, orderBy: { dia: 'asc' } });
  }

  async findOneDiaAeropuerto(idPeriodo: number, dia: Date) {
    const da = await this.prisma.diaAeropuerto.findUnique({
      where: { idPeriodo_dia: { idPeriodo, dia } },
    });
    if (!da) throw new NotFoundException('Día de aeropuerto no encontrado');
    return da;
  }

  async createDiaAeropuerto(dto: CreateDiaAeropuertoDto) {
    const periodo = await this.prisma.periodo.findUnique({
      where: { id: dto.idPeriodo },
    });
    if (!periodo) throw new BadRequestException('El período especificado no existe');

    if (dto.idAeropuerto !== undefined) {
      const aeropuerto = await this.prisma.aeropuerto.findUnique({
        where: { id: dto.idAeropuerto },
      });
      if (!aeropuerto) throw new BadRequestException('El aeropuerto especificado no existe');
    }

    const diaDate = new Date(dto.dia);

    return this.prisma.diaAeropuerto.create({
      data: {
        idPeriodo: dto.idPeriodo,
        dia: diaDate,
        abierto: dto.abierto ?? 'S',
        idAeropuerto: dto.idAeropuerto,
      },
    });
  }

  async updateDiaAeropuerto(idPeriodo: number, dia: Date, dto: UpdateDiaAeropuertoDto) {
    await this.findOneDiaAeropuerto(idPeriodo, dia);

    if (dto.idAeropuerto !== undefined) {
      const aeropuerto = await this.prisma.aeropuerto.findUnique({
        where: { id: dto.idAeropuerto },
      });
      if (!aeropuerto) throw new BadRequestException('El aeropuerto especificado no existe');
    }

    return this.prisma.diaAeropuerto.update({
      where: { idPeriodo_dia: { idPeriodo, dia } },
      data: dto,
    });
  }

  async removeDiaAeropuerto(idPeriodo: number, dia: Date) {
    await this.findOneDiaAeropuerto(idPeriodo, dia);
    return this.prisma.diaAeropuerto.delete({
      where: { idPeriodo_dia: { idPeriodo, dia } },
    });
  }

  async abrirDia(idPeriodo: number, dia: Date) {
    await this.findOneDiaAeropuerto(idPeriodo, dia);
    return this.prisma.diaAeropuerto.update({
      where: { idPeriodo_dia: { idPeriodo, dia } },
      data: { abierto: 'S' },
    });
  }

  async cerrarDia(idPeriodo: number, dia: Date) {
    await this.findOneDiaAeropuerto(idPeriodo, dia);
    return this.prisma.diaAeropuerto.update({
      where: { idPeriodo_dia: { idPeriodo, dia } },
      data: { abierto: 'N' },
    });
  }

  // ============================================================
  // DIAS FERIADOS
  // ============================================================

  async findAllDiasFeriados() {
    return this.prisma.diaFeriado.findMany({ orderBy: { id: 'asc' } });
  }

  async findOneDiaFeriado(id: number) {
    const df = await this.prisma.diaFeriado.findUnique({ where: { id } });
    if (!df) throw new NotFoundException('Día feriado no encontrado');
    return df;
  }

  async createDiaFeriado(dto: CreateDiaFeriadoDto) {
    if (dto.fecha) {
      const existente = await this.prisma.diaFeriado.findFirst({
        where: { fecha: new Date(dto.fecha) },
      });
      if (existente) {
        throw new BadRequestException('Ya existe un feriado registrado en esa fecha');
      }
    }

    return this.prisma.diaFeriado.create({
      data: {
        fecha: dto.fecha ? new Date(dto.fecha) : undefined,
      },
    });
  }

  async updateDiaFeriado(id: number, dto: UpdateDiaFeriadoDto) {
    await this.findOneDiaFeriado(id);

    if (dto.fecha) {
      const existente = await this.prisma.diaFeriado.findFirst({
        where: { fecha: new Date(dto.fecha) },
      });
      if (existente && existente.id !== id) {
        throw new BadRequestException('Ya existe un feriado registrado en esa fecha');
      }
    }

    return this.prisma.diaFeriado.update({
      where: { id },
      data: {
        fecha: dto.fecha ? new Date(dto.fecha) : undefined,
      },
    });
  }

  async removeDiaFeriado(id: number) {
    await this.findOneDiaFeriado(id);
    return this.prisma.diaFeriado.delete({ where: { id } });
  }

  async esFeriado(fecha: string): Promise<VerificarFeriadoDto> {
    const date = new Date(fecha);
    const count = await this.prisma.diaFeriado.count({
      where: {
        fecha: {
          gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
        },
      },
    });
    return { esFeriado: count > 0 };
  }
}
