import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItinerarioDto } from './dto/create-itinerario.dto';
import { UpdateItinerarioDto } from './dto/update-itinerario.dto';
import { CreateVueloDto } from './dto/create-vuelo.dto';
import { UpdateVueloDto } from './dto/update-vuelo.dto';
import { CreatePuertaEmbarqueDto } from './dto/create-puerta-embarque.dto';
import { UpdatePuertaEmbarqueDto } from './dto/update-puerta-embarque.dto';
import { CreateHangarDto } from './dto/create-hangar.dto';
import { UpdateHangarDto } from './dto/update-hangar.dto';
import { CreateServicioOperacionDto } from './dto/create-servicio-operacion.dto';
import { UpdateServicioOperacionDto } from './dto/update-servicio-operacion.dto';
import { CreateRegistroPesoDto } from './dto/create-registro-peso.dto';
import { UpdateRegistroPesoDto } from './dto/update-registro-peso.dto';
import { CreateAsignacionPuertaVueloDto } from './dto/create-asignacion-puerta-vuelo.dto';
import { UpdateAsignacionPuertaVueloDto } from './dto/update-asignacion-puerta-vuelo.dto';
import { CreateNotaOperacionDto } from './dto/create-nota-operacion.dto';
import { UpdateNotaOperacionDto } from './dto/update-nota-operacion.dto';
import type { Prisma } from '@prisma/client';

@Injectable()
export class OperacionesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // ── ITINERARIO ──
  async findAllItinerarios(query?: {
    codAeropuerto?: string;
    codAerolinea?: string;
    ejecutado?: string;
    skip?: string;
    take?: string;
  }) {
    const where: Prisma.ItinerarioWhereInput = {};
    if (query?.codAeropuerto) where.codAeropuerto = query.codAeropuerto;
    if (query?.codAerolinea) where.codAerolinea = query.codAerolinea;
    if (query?.ejecutado !== undefined) where.ejecutado = query.ejecutado === 'true';
    const skip = query?.skip ? parseInt(query.skip, 10) : undefined;
    const take = query?.take ? parseInt(query.take, 10) : undefined;
    return this.prisma.itinerario.findMany({
      where,
      skip,
      take,
      orderBy: { horaVuelo: 'desc' },
    });
  }

  async findOneItinerario(id: number) {
    const record = await this.prisma.itinerario.findUnique({ where: { id } });
    if (!record) throw new NotFoundException(`Itinerario ${id} no encontrado`);
    return record;
  }

  async createItinerario(dto: CreateItinerarioDto) {
    return this.prisma.itinerario.create({ data: dto as any });
  }

  async updateItinerario(id: number, dto: UpdateItinerarioDto) {
    await this.findOneItinerario(id);
    return this.prisma.itinerario.update({ where: { id }, data: dto as any });
  }

  async removeItinerario(id: number) {
    await this.findOneItinerario(id);
    return this.prisma.itinerario.delete({ where: { id } });
  }

  // ── VUELO ──
  async findAllVuelos(query?: {
    idAerolinea?: string;
    origen?: string;
    destino?: string;
    skip?: string;
    take?: string;
  }) {
    const where: Prisma.VueloWhereInput = {};
    if (query?.idAerolinea) where.idAerolinea = parseInt(query.idAerolinea, 10);
    if (query?.origen) where.origen = parseInt(query.origen, 10);
    if (query?.destino) where.destino = parseInt(query.destino, 10);
    const skip = query?.skip ? parseInt(query.skip, 10) : undefined;
    const take = query?.take ? parseInt(query.take, 10) : undefined;
    return this.prisma.vuelo.findMany({ where, skip, take, orderBy: { id: 'asc' } });
  }

  async findOneVuelo(id: number) {
    const record = await this.prisma.vuelo.findUnique({ where: { id } });
    if (!record) throw new NotFoundException(`Vuelo ${id} no encontrado`);
    return record;
  }

  async createVuelo(dto: CreateVueloDto) {
    const existente = await this.prisma.vuelo.findFirst({
      where: { codigo: dto.codigo },
    });
    if (existente)
      throw new BadRequestException(`Ya existe un vuelo con código ${dto.codigo}`);
    return this.prisma.vuelo.create({ data: dto });
  }

  async updateVuelo(id: number, dto: UpdateVueloDto) {
    await this.findOneVuelo(id);
    if (dto.codigo) {
      const existente = await this.prisma.vuelo.findFirst({
        where: { codigo: dto.codigo, NOT: { id } },
      });
      if (existente)
        throw new BadRequestException(`Ya existe un vuelo con código ${dto.codigo}`);
    }
    return this.prisma.vuelo.update({ where: { id }, data: dto });
  }

  async removeVuelo(id: number) {
    await this.findOneVuelo(id);
    const itinerarios = await this.prisma.itinerario.count({
      where: { idVuelo: id },
    });
    if (itinerarios > 0)
      throw new BadRequestException(
        'No se puede eliminar el vuelo porque tiene itinerarios asociados',
      );
    return this.prisma.vuelo.delete({ where: { id } });
  }

  // ── PUERTA EMBARQUE ──
  async findAllPuertasEmbarque(idAeropuerto: number, query?: { skip?: string; take?: string }) {
    const where: Prisma.PuertaEmbarqueWhereInput = {
      idAeropuerto,
      activo: true,
    };
    const skip = query?.skip ? parseInt(query.skip, 10) : undefined;
    const take = query?.take ? parseInt(query.take, 10) : undefined;
    return this.prisma.puertaEmbarque.findMany({
      where,
      skip,
      take,
      orderBy: { codigo: 'asc' },
    });
  }

  async findOnePuertaEmbarque(id: number) {
    const record = await this.prisma.puertaEmbarque.findUnique({ where: { id } });
    if (!record) throw new NotFoundException(`Puerta de embarque ${id} no encontrada`);
    return record;
  }

  async createPuertaEmbarque(dto: CreatePuertaEmbarqueDto) {
    const existente = await this.prisma.puertaEmbarque.findFirst({
      where: { codigo: dto.codigo, idAeropuerto: dto.idAeropuerto },
    });
    if (existente)
      throw new BadRequestException(
        `Ya existe una puerta con código ${dto.codigo} en este aeropuerto`,
      );
    return this.prisma.puertaEmbarque.create({ data: dto });
  }

  async updatePuertaEmbarque(id: number, dto: UpdatePuertaEmbarqueDto) {
    await this.findOnePuertaEmbarque(id);
    if (dto.codigo || dto.idAeropuerto) {
      const current = await this.prisma.puertaEmbarque.findUnique({ where: { id } });
      const existente = await this.prisma.puertaEmbarque.findFirst({
        where: {
          codigo: dto.codigo ?? current!.codigo,
          idAeropuerto: dto.idAeropuerto ?? current!.idAeropuerto,
          NOT: { id },
        },
      });
      if (existente)
        throw new BadRequestException(
          'Ya existe una puerta con este código en el aeropuerto',
        );
    }
    return this.prisma.puertaEmbarque.update({ where: { id }, data: dto });
  }

  async removePuertaEmbarque(id: number) {
    await this.findOnePuertaEmbarque(id);
    const asignaciones = await this.prisma.asignacionPuertaVuelo.count({
      where: { idPuerta: id },
    });
    if (asignaciones > 0)
      throw new BadRequestException(
        'No se puede eliminar la puerta porque tiene asignaciones asociadas',
      );
    return this.prisma.puertaEmbarque.delete({ where: { id } });
  }

  // ── HANGAR ──
  async findAllHangares(idAeropuerto: number, query?: { tipoZona?: string; skip?: string; take?: string }) {
    const where: Prisma.HangarWhereInput = { idAeropuerto };
    if (query?.tipoZona) where.tipoZona = parseInt(query.tipoZona, 10);
    const skip = query?.skip ? parseInt(query.skip, 10) : undefined;
    const take = query?.take ? parseInt(query.take, 10) : undefined;
    return this.prisma.hangar.findMany({
      where,
      skip,
      take,
      orderBy: { codigo: 'asc' },
    });
  }

  async findOneHangar(id: number) {
    const record = await this.prisma.hangar.findUnique({ where: { id } });
    if (!record) throw new NotFoundException(`Hangar ${id} no encontrado`);
    return record;
  }

  async createHangar(dto: CreateHangarDto) {
    const existente = await this.prisma.hangar.findFirst({
      where: { codigo: dto.codigo, idAeropuerto: dto.idAeropuerto },
    });
    if (existente)
      throw new BadRequestException(
        `Ya existe un hangar con código ${dto.codigo} en este aeropuerto`,
      );
    return this.prisma.hangar.create({ data: dto });
  }

  async updateHangar(id: number, dto: UpdateHangarDto) {
    await this.findOneHangar(id);
    if (dto.codigo || dto.idAeropuerto) {
      const current = await this.prisma.hangar.findUnique({ where: { id } });
      const existente = await this.prisma.hangar.findFirst({
        where: {
          codigo: dto.codigo ?? current!.codigo,
          idAeropuerto: dto.idAeropuerto ?? current!.idAeropuerto,
          NOT: { id },
        },
      });
      if (existente)
        throw new BadRequestException(
          'Ya existe un hangar con este código en el aeropuerto',
        );
    }
    return this.prisma.hangar.update({ where: { id }, data: dto });
  }

  async removeHangar(id: number) {
    await this.findOneHangar(id);
    return this.prisma.hangar.delete({ where: { id } });
  }

  // ── SERVICIO OPERACION ──
  async findAllServiciosOperacion(query?: {
    idOperacion?: string;
    tipoServicio?: string;
    skip?: string;
    take?: string;
  }) {
    const where: Prisma.ServicioOperacionWhereInput = {};
    if (query?.idOperacion) where.idOperacion = parseInt(query.idOperacion, 10);
    if (query?.tipoServicio) where.tipoServicio = query.tipoServicio;
    const skip = query?.skip ? parseInt(query.skip, 10) : undefined;
    const take = query?.take ? parseInt(query.take, 10) : undefined;
    return this.prisma.servicioOperacion.findMany({
      where,
      skip,
      take,
      orderBy: { id: 'asc' },
    });
  }

  async findOneServicioOperacion(id: number) {
    const record = await this.prisma.servicioOperacion.findUnique({
      where: { id },
    });
    if (!record)
      throw new NotFoundException(`Servicio de operación ${id} no encontrado`);
    return record;
  }

  async createServicioOperacion(dto: CreateServicioOperacionDto) {
    return this.prisma.servicioOperacion.create({ data: dto as any });
  }

  async updateServicioOperacion(id: number, dto: UpdateServicioOperacionDto) {
    await this.findOneServicioOperacion(id);
    return this.prisma.servicioOperacion.update({ where: { id }, data: dto as any });
  }

  async removeServicioOperacion(id: number) {
    await this.findOneServicioOperacion(id);
    return this.prisma.servicioOperacion.delete({ where: { id } });
  }

  // ── REGISTRO PESO ──
  async findAllRegistrosPeso(query?: { idOperacion?: string; skip?: string; take?: string }) {
    const where: Prisma.RegistroPesoWhereInput = {};
    if (query?.idOperacion) where.idOperacion = parseInt(query.idOperacion, 10);
    const skip = query?.skip ? parseInt(query.skip, 10) : undefined;
    const take = query?.take ? parseInt(query.take, 10) : undefined;
    return this.prisma.registroPeso.findMany({
      where,
      skip,
      take,
      orderBy: { fecha: 'desc' },
    });
  }

  async findOneRegistroPeso(id: number) {
    const record = await this.prisma.registroPeso.findUnique({ where: { id } });
    if (!record) throw new NotFoundException(`Registro de peso ${id} no encontrado`);
    return record;
  }

  async createRegistroPeso(dto: CreateRegistroPesoDto) {
    return this.prisma.registroPeso.create({ data: dto as any });
  }

  async updateRegistroPeso(id: number, dto: UpdateRegistroPesoDto) {
    await this.findOneRegistroPeso(id);
    return this.prisma.registroPeso.update({ where: { id }, data: dto as any });
  }

  async removeRegistroPeso(id: number) {
    await this.findOneRegistroPeso(id);
    return this.prisma.registroPeso.delete({ where: { id } });
  }

  // ── ASIGNACION PUERTA VUELO ──
  async findAllAsignacionesPuertaVuelo(query?: {
    idOperacion?: string;
    idPuerta?: string;
    skip?: string;
    take?: string;
  }) {
    const where: Prisma.AsignacionPuertaVueloWhereInput = {};
    if (query?.idOperacion) where.idOperacion = parseInt(query.idOperacion, 10);
    if (query?.idPuerta) where.idPuerta = parseInt(query.idPuerta, 10);
    const skip = query?.skip ? parseInt(query.skip, 10) : undefined;
    const take = query?.take ? parseInt(query.take, 10) : undefined;
    return this.prisma.asignacionPuertaVuelo.findMany({
      where,
      skip,
      take,
      orderBy: { id: 'asc' },
    });
  }

  async findOneAsignacionPuertaVuelo(id: number) {
    const record = await this.prisma.asignacionPuertaVuelo.findUnique({
      where: { id },
    });
    if (!record)
      throw new NotFoundException(`Asignación puerta-vuelo ${id} no encontrada`);
    return record;
  }

  async createAsignacionPuertaVuelo(dto: CreateAsignacionPuertaVueloDto) {
    return this.prisma.asignacionPuertaVuelo.create({ data: dto as any });
  }

  async updateAsignacionPuertaVuelo(id: number, dto: UpdateAsignacionPuertaVueloDto) {
    await this.findOneAsignacionPuertaVuelo(id);
    return this.prisma.asignacionPuertaVuelo.update({
      where: { id },
      data: dto as any,
    });
  }

  async removeAsignacionPuertaVuelo(id: number) {
    await this.findOneAsignacionPuertaVuelo(id);
    return this.prisma.asignacionPuertaVuelo.delete({ where: { id } });
  }

  // ── NOTA OPERACION ──
  async findAllNotasOperacion(query?: { idOperacion?: string; skip?: string; take?: string }) {
    const where: Prisma.NotaOperacionWhereInput = {};
    if (query?.idOperacion) where.idOperacion = BigInt(query.idOperacion);
    const skip = query?.skip ? parseInt(query.skip, 10) : undefined;
    const take = query?.take ? parseInt(query.take, 10) : undefined;
    return this.prisma.notaOperacion.findMany({
      where,
      skip,
      take,
      orderBy: { fecha: 'desc' },
    });
  }

  async findOneNotaOperacion(id: number) {
    const record = await this.prisma.notaOperacion.findUnique({
      where: { id: BigInt(id) },
    });
    if (!record)
      throw new NotFoundException(`Nota de operación ${id} no encontrada`);
    return record;
  }

  async createNotaOperacion(dto: CreateNotaOperacionDto) {
    const data: any = { ...dto };
    if (dto.idOperacion !== undefined) data.idOperacion = BigInt(dto.idOperacion);
    return this.prisma.notaOperacion.create({ data });
  }

  async updateNotaOperacion(id: number, dto: UpdateNotaOperacionDto) {
    await this.findOneNotaOperacion(id);
    const data: any = { ...dto };
    if (dto.idOperacion !== undefined) data.idOperacion = BigInt(dto.idOperacion);
    return this.prisma.notaOperacion.update({
      where: { id: BigInt(id) },
      data,
    });
  }

  async removeNotaOperacion(id: number) {
    await this.findOneNotaOperacion(id);
    return this.prisma.notaOperacion.delete({ where: { id: BigInt(id) } });
  }

  // ── PANEL DE OPERACIONES ──
  async findOperacionesPanel(idAeropuerto: number, estado?: string) {
    const filter: Prisma.ItinerarioWhereInput = {};
    if (estado !== undefined) filter.ejecutado = estado === 'true';

    const itinerarios = await this.prisma.itinerario.findMany({
      where: filter,
      orderBy: { horaVuelo: 'desc' },
      take: 50,
    });

    return itinerarios.map((it) => ({
      id: it.id,
      codigo: it.numeroVuelo,
      idVuelo: it.idVuelo,
      aerolineaCodigo: it.codAerolinea,
      origen: it.codAeropuerto,
      destino: it.aeropuertoDest,
      fecha: it.horaVuelo.toISOString(),
      estado: it.estado,
      tieneEntrada: it.ejecutado,
      tieneSalida: it.ejecutado,
    }));
  }
}
