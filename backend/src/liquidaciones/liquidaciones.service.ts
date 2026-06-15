import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Prisma } from '@prisma/client';
import { CreateLiquidacionDto } from './dto/create-liquidacion.dto';
import { UpdateLiquidacionDto } from './dto/update-liquidacion.dto';
import { CreateItemLiquidacionDto } from './dto/create-item-liquidacion.dto';
import { UpdateItemLiquidacionDto } from './dto/update-item-liquidacion.dto';
import { CreatePasajeroNacionalDto } from './dto/create-pasajero-nacional.dto';
import { UpdatePasajeroNacionalDto } from './dto/update-pasajero-nacional.dto';
import { CreatePasajeroInternacionalDto } from './dto/create-pasajero-internacional.dto';
import { UpdatePasajeroInternacionalDto } from './dto/update-pasajero-internacional.dto';
import { CreateTasaDto } from './dto/create-tasa.dto';
import { UpdateTasaDto } from './dto/update-tasa.dto';
import { CreateTipoPasajeroDto } from './dto/create-tipo-pasajero.dto';
import { UpdateTipoPasajeroDto } from './dto/update-tipo-pasajero.dto';
import { CreateClasePasajeroDto } from './dto/create-clase-pasajero.dto';
import { UpdateClasePasajeroDto } from './dto/update-clase-pasajero.dto';

@Injectable()
export class LiquidacionesService {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================================
  // LIQUIDACION
  // ============================================================

  async findAllLiquidaciones(query?: {
    idAeropuerto?: string;
    idAerolinea?: string;
    estado?: string;
    skip?: string;
    take?: string;
  }) {
    const where: Prisma.LiquidacionWhereInput = {};
    if (query?.idAeropuerto) {
      where.idAeropuerto = parseInt(query.idAeropuerto, 10);
    }
    if (query?.idAerolinea) {
      where.idAerolinea = parseInt(query.idAerolinea, 10);
    }
    if (query?.estado) {
      where.estado = query.estado;
    }
    const skip = query?.skip ? parseInt(query.skip, 10) : undefined;
    const take = query?.take ? parseInt(query.take, 10) : undefined;
    return this.prisma.liquidacion.findMany({ where, skip, take, orderBy: { id: 'asc' } });
  }

  async findOneLiquidacion(id: number) {
    const record = await this.prisma.liquidacion.findUnique({ where: { id } });
    if (!record) throw new NotFoundException(`Liquidación con ID ${id} no encontrada`);
    return record;
  }

  async createLiquidacion(dto: CreateLiquidacionDto) {
    const existente = await this.prisma.liquidacion.findUnique({ where: { codigo: dto.codigo } });
    if (existente) throw new BadRequestException(`Ya existe una liquidación con código ${dto.codigo}`);
    return this.prisma.liquidacion.create({ data: { ...dto, fecha: dto.fecha ? new Date(dto.fecha) : undefined } as any });
  }

  async updateLiquidacion(id: number, dto: UpdateLiquidacionDto) {
    await this.findOneLiquidacion(id);
    if (dto.codigo) {
      const existente = await this.prisma.liquidacion.findFirst({ where: { codigo: dto.codigo, NOT: { id } } });
      if (existente) throw new BadRequestException(`Ya existe una liquidación con código ${dto.codigo}`);
    }
    return this.prisma.liquidacion.update({
      where: { id },
      data: { ...dto, fecha: dto.fecha ? new Date(dto.fecha) : undefined } as any,
    });
  }

  async removeLiquidacion(id: number) {
    await this.findOneLiquidacion(id);
    const items = await this.prisma.itemLiquidacion.count({ where: { idLiquidacion: id } });
    if (items > 0) throw new BadRequestException('No se puede eliminar la liquidación porque tiene items asociados');
    return this.prisma.liquidacion.delete({ where: { id } });
  }

  // ============================================================
  // ITEM LIQUIDACION
  // ============================================================

  async findAllItemsLiquidacion(query?: { idLiquidacion?: string }) {
    const where: Prisma.ItemLiquidacionWhereInput = {};
    if (query?.idLiquidacion) {
      where.idLiquidacion = parseInt(query.idLiquidacion, 10);
    }
    return this.prisma.itemLiquidacion.findMany({ where, orderBy: { id: 'asc' } });
  }

  async findOneItemLiquidacion(id: number) {
    const record = await this.prisma.itemLiquidacion.findUnique({ where: { id } });
    if (!record) throw new NotFoundException(`Item de liquidación con ID ${id} no encontrado`);
    return record;
  }

  async createItemLiquidacion(dto: CreateItemLiquidacionDto) {
    if (dto.idLiquidacion) {
      const liquidacion = await this.prisma.liquidacion.findUnique({ where: { id: dto.idLiquidacion } });
      if (!liquidacion) throw new BadRequestException(`Liquidación con ID ${dto.idLiquidacion} no existe`);
    }
    return this.prisma.itemLiquidacion.create({ data: dto as any });
  }

  async updateItemLiquidacion(id: number, dto: UpdateItemLiquidacionDto) {
    await this.findOneItemLiquidacion(id);
    if (dto.idLiquidacion) {
      const liquidacion = await this.prisma.liquidacion.findUnique({ where: { id: dto.idLiquidacion } });
      if (!liquidacion) throw new BadRequestException(`Liquidación con ID ${dto.idLiquidacion} no existe`);
    }
    return this.prisma.itemLiquidacion.update({ where: { id }, data: dto as any });
  }

  async removeItemLiquidacion(id: number) {
    await this.findOneItemLiquidacion(id);
    return this.prisma.itemLiquidacion.delete({ where: { id } });
  }

  // ============================================================
  // PASAJERO NACIONAL
  // ============================================================

  async findAllPasajerosNacionales(query?: { idLiquidacion?: string; idAerolinea?: string }) {
    const where: Prisma.PasajeroNacionalWhereInput = {};
    if (query?.idLiquidacion) {
      where.idLiquidacion = parseInt(query.idLiquidacion, 10);
    }
    if (query?.idAerolinea) {
      where.idAerolinea = parseInt(query.idAerolinea, 10);
    }
    return this.prisma.pasajeroNacional.findMany({ where, orderBy: { id: 'asc' } });
  }

  async findOnePasajeroNacional(id: number) {
    const record = await this.prisma.pasajeroNacional.findUnique({ where: { id } });
    if (!record) throw new NotFoundException(`Pasajero nacional con ID ${id} no encontrado`);
    return record;
  }

  async createPasajeroNacional(dto: CreatePasajeroNacionalDto) {
    const liquidacion = await this.prisma.liquidacion.findUnique({ where: { id: dto.idLiquidacion } });
    if (!liquidacion) throw new BadRequestException(`Liquidación con ID ${dto.idLiquidacion} no existe`);
    if (dto.idTipoPasajero) {
      const tipo = await this.prisma.tipoPasajero.findUnique({ where: { id: dto.idTipoPasajero } });
      if (!tipo) throw new BadRequestException(`Tipo de pasajero con ID ${dto.idTipoPasajero} no existe`);
    }
    if (dto.idClasePasajero) {
      const clase = await this.prisma.clasePasajero.findUnique({ where: { id: dto.idClasePasajero } });
      if (!clase) throw new BadRequestException(`Clase de pasajero con ID ${dto.idClasePasajero} no existe`);
    }
    return this.prisma.pasajeroNacional.create({ data: { ...dto, fecha: new Date(dto.fecha) } as any });
  }

  async updatePasajeroNacional(id: number, dto: UpdatePasajeroNacionalDto) {
    await this.findOnePasajeroNacional(id);
    if (dto.idLiquidacion) {
      const liquidacion = await this.prisma.liquidacion.findUnique({ where: { id: dto.idLiquidacion } });
      if (!liquidacion) throw new BadRequestException(`Liquidación con ID ${dto.idLiquidacion} no existe`);
    }
    if (dto.idTipoPasajero) {
      const tipo = await this.prisma.tipoPasajero.findUnique({ where: { id: dto.idTipoPasajero } });
      if (!tipo) throw new BadRequestException(`Tipo de pasajero con ID ${dto.idTipoPasajero} no existe`);
    }
    if (dto.idClasePasajero) {
      const clase = await this.prisma.clasePasajero.findUnique({ where: { id: dto.idClasePasajero } });
      if (!clase) throw new BadRequestException(`Clase de pasajero con ID ${dto.idClasePasajero} no existe`);
    }
    return this.prisma.pasajeroNacional.update({
      where: { id },
      data: { ...dto, fecha: dto.fecha ? new Date(dto.fecha) : undefined } as any,
    });
  }

  async removePasajeroNacional(id: number) {
    await this.findOnePasajeroNacional(id);
    return this.prisma.pasajeroNacional.delete({ where: { id } });
  }

  // ============================================================
  // PASAJERO INTERNACIONAL
  // ============================================================

  async findAllPasajerosInternacionales(query?: { idLiquidacion?: string; idAerolinea?: string }) {
    const where: Prisma.PasajeroInternacionalWhereInput = {};
    if (query?.idLiquidacion) {
      where.idLiquidacion = parseInt(query.idLiquidacion, 10);
    }
    if (query?.idAerolinea) {
      where.idAerolinea = parseInt(query.idAerolinea, 10);
    }
    return this.prisma.pasajeroInternacional.findMany({ where, orderBy: { id: 'asc' } });
  }

  async findOnePasajeroInternacional(id: number) {
    const record = await this.prisma.pasajeroInternacional.findUnique({ where: { id } });
    if (!record) throw new NotFoundException(`Pasajero internacional con ID ${id} no encontrado`);
    return record;
  }

  async createPasajeroInternacional(dto: CreatePasajeroInternacionalDto) {
    const liquidacion = await this.prisma.liquidacion.findUnique({ where: { id: dto.idLiquidacion } });
    if (!liquidacion) throw new BadRequestException(`Liquidación con ID ${dto.idLiquidacion} no existe`);
    return this.prisma.pasajeroInternacional.create({ data: { ...dto, fecha: new Date(dto.fecha) } as any });
  }

  async updatePasajeroInternacional(id: number, dto: UpdatePasajeroInternacionalDto) {
    await this.findOnePasajeroInternacional(id);
    if (dto.idLiquidacion) {
      const liquidacion = await this.prisma.liquidacion.findUnique({ where: { id: dto.idLiquidacion } });
      if (!liquidacion) throw new BadRequestException(`Liquidación con ID ${dto.idLiquidacion} no existe`);
    }
    return this.prisma.pasajeroInternacional.update({
      where: { id },
      data: { ...dto, fecha: dto.fecha ? new Date(dto.fecha) : undefined } as any,
    });
  }

  async removePasajeroInternacional(id: number) {
    await this.findOnePasajeroInternacional(id);
    return this.prisma.pasajeroInternacional.delete({ where: { id } });
  }

  // ============================================================
  // TASA
  // ============================================================

  async findAllTasas() {
    return this.prisma.tasa.findMany({ orderBy: { id: 'asc' } });
  }

  async findOneTasa(id: number) {
    const record = await this.prisma.tasa.findUnique({ where: { id } });
    if (!record) throw new NotFoundException(`Tasa con ID ${id} no encontrada`);
    return record;
  }

  async createTasa(dto: CreateTasaDto) {
    const existente = await this.prisma.tasa.findFirst({ where: { codigo: dto.codigo } });
    if (existente) throw new BadRequestException(`Ya existe una tasa con código ${dto.codigo}`);
    return this.prisma.tasa.create({ data: dto as any });
  }

  async updateTasa(id: number, dto: UpdateTasaDto) {
    await this.findOneTasa(id);
    if (dto.codigo) {
      const existente = await this.prisma.tasa.findFirst({ where: { codigo: dto.codigo, NOT: { id } } });
      if (existente) throw new BadRequestException(`Ya existe una tasa con código ${dto.codigo}`);
    }
    return this.prisma.tasa.update({ where: { id }, data: dto as any });
  }

  async removeTasa(id: number) {
    await this.findOneTasa(id);
    return this.prisma.tasa.delete({ where: { id } });
  }

  // ============================================================
  // TIPO PASAJERO
  // ============================================================

  async findAllTiposPasajero(query?: { exento?: string }) {
    const where: Prisma.TipoPasajeroWhereInput = {};
    if (query?.exento !== undefined) {
      where.exento = query.exento === 'true';
    }
    return this.prisma.tipoPasajero.findMany({ where, orderBy: { id: 'asc' } });
  }

  async findOneTipoPasajero(id: number) {
    const record = await this.prisma.tipoPasajero.findUnique({ where: { id } });
    if (!record) throw new NotFoundException(`Tipo de pasajero con ID ${id} no encontrado`);
    return record;
  }

  async createTipoPasajero(dto: CreateTipoPasajeroDto) {
    const existente = await this.prisma.tipoPasajero.findFirst({ where: { codigo: dto.codigo } });
    if (existente) throw new BadRequestException(`Ya existe un tipo de pasajero con código ${dto.codigo}`);
    if (dto.idClasePasajero) {
      const clase = await this.prisma.clasePasajero.findUnique({ where: { id: dto.idClasePasajero } });
      if (!clase) throw new BadRequestException(`Clase de pasajero con ID ${dto.idClasePasajero} no existe`);
    }
    return this.prisma.tipoPasajero.create({ data: dto });
  }

  async updateTipoPasajero(id: number, dto: UpdateTipoPasajeroDto) {
    await this.findOneTipoPasajero(id);
    if (dto.codigo) {
      const existente = await this.prisma.tipoPasajero.findFirst({ where: { codigo: dto.codigo, NOT: { id } } });
      if (existente) throw new BadRequestException(`Ya existe un tipo de pasajero con código ${dto.codigo}`);
    }
    if (dto.idClasePasajero) {
      const clase = await this.prisma.clasePasajero.findUnique({ where: { id: dto.idClasePasajero } });
      if (!clase) throw new BadRequestException(`Clase de pasajero con ID ${dto.idClasePasajero} no existe`);
    }
    return this.prisma.tipoPasajero.update({ where: { id }, data: dto });
  }

  async removeTipoPasajero(id: number) {
    await this.findOneTipoPasajero(id);
    const nacionales = await this.prisma.pasajeroNacional.count({ where: { idTipoPasajero: id } });
    if (nacionales > 0) throw new BadRequestException('No se puede eliminar el tipo de pasajero porque tiene pasajeros nacionales asociados');
    return this.prisma.tipoPasajero.delete({ where: { id } });
  }

  // ============================================================
  // CLASE PASAJERO
  // ============================================================

  async findAllClasesPasajero() {
    return this.prisma.clasePasajero.findMany({ orderBy: { id: 'asc' } });
  }

  async findOneClasePasajero(id: number) {
    const record = await this.prisma.clasePasajero.findUnique({ where: { id } });
    if (!record) throw new NotFoundException(`Clase de pasajero con ID ${id} no encontrada`);
    return record;
  }

  async createClasePasajero(dto: CreateClasePasajeroDto) {
    const existente = await this.prisma.clasePasajero.findFirst({ where: { codigo: dto.codigo } });
    if (existente) throw new BadRequestException(`Ya existe una clase de pasajero con código ${dto.codigo}`);
    return this.prisma.clasePasajero.create({ data: dto });
  }

  async updateClasePasajero(id: number, dto: UpdateClasePasajeroDto) {
    await this.findOneClasePasajero(id);
    if (dto.codigo) {
      const existente = await this.prisma.clasePasajero.findFirst({ where: { codigo: dto.codigo, NOT: { id } } });
      if (existente) throw new BadRequestException(`Ya existe una clase de pasajero con código ${dto.codigo}`);
    }
    return this.prisma.clasePasajero.update({ where: { id }, data: dto });
  }

  async removeClasePasajero(id: number) {
    await this.findOneClasePasajero(id);
    const tipos = await this.prisma.tipoPasajero.count({ where: { idClasePasajero: id } });
    if (tipos > 0) throw new BadRequestException('No se puede eliminar la clase de pasajero porque tiene tipos de pasajero asociados');
    return this.prisma.clasePasajero.delete({ where: { id } });
  }
}
