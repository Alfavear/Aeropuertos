import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Prisma } from '@prisma/client';
import { CreateConceptoDto } from './dto/create-concepto.dto';
import { UpdateConceptoDto } from './dto/update-concepto.dto';
import { CreateGrupoConceptoDto } from './dto/create-grupo-concepto.dto';
import { UpdateGrupoConceptoDto } from './dto/update-grupo-concepto.dto';
import { CreateTipoOperacionDto } from './dto/create-tipo-operacion.dto';
import { UpdateTipoOperacionDto } from './dto/update-tipo-operacion.dto';
import { CreateTarifaOperacionDto } from './dto/create-tarifa-operacion.dto';
import { UpdateTarifaOperacionDto } from './dto/update-tarifa-operacion.dto';
import { CreateTarifaAerolineaDto } from './dto/create-tarifa-aerolinea.dto';
import { UpdateTarifaAerolineaDto } from './dto/update-tarifa-aerolinea.dto';
import { CreateImpuestoDto } from './dto/create-impuesto.dto';
import { UpdateImpuestoDto } from './dto/update-impuesto.dto';

@Injectable()
export class TarifasService {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================================
  // CONCEPTO
  // ============================================================

  async findAllConceptos(query?: {
    activo?: string;
    idGrupoConcepto?: string;
    skip?: string;
    take?: string;
  }) {
    const where: Prisma.ConceptoWhereInput = {};
    if (query?.activo !== undefined) {
      where.activo = query.activo === 'true';
    }
    if (query?.idGrupoConcepto) {
      where.idGrupoConcepto = parseInt(query.idGrupoConcepto, 10);
    }
    const skip = query?.skip ? parseInt(query.skip, 10) : undefined;
    const take = query?.take ? parseInt(query.take, 10) : undefined;
    return this.prisma.concepto.findMany({ where, skip, take, orderBy: { id: 'asc' } });
  }

  async findOneConcepto(id: number) {
    const record = await this.prisma.concepto.findUnique({ where: { id } });
    if (!record) throw new NotFoundException(`Concepto con ID ${id} no encontrado`);
    return record;
  }

  async createConcepto(dto: CreateConceptoDto) {
    const existente = await this.prisma.concepto.findFirst({ where: { codigo: dto.codigo } });
    if (existente) throw new BadRequestException(`Ya existe un concepto con código ${dto.codigo}`);
    if (dto.idGrupoConcepto) {
      const grupo = await this.prisma.grupoConcepto.findUnique({ where: { id: dto.idGrupoConcepto } });
      if (!grupo) throw new BadRequestException(`Grupo de concepto con ID ${dto.idGrupoConcepto} no existe`);
    }
    return this.prisma.concepto.create({ data: dto as any });
  }

  async updateConcepto(id: number, dto: UpdateConceptoDto) {
    await this.findOneConcepto(id);
    if (dto.idGrupoConcepto) {
      const grupo = await this.prisma.grupoConcepto.findUnique({ where: { id: dto.idGrupoConcepto } });
      if (!grupo) throw new BadRequestException(`Grupo de concepto con ID ${dto.idGrupoConcepto} no existe`);
    }
    if (dto.codigo) {
      const existente = await this.prisma.concepto.findFirst({ where: { codigo: dto.codigo, NOT: { id } } });
      if (existente) throw new BadRequestException(`Ya existe un concepto con código ${dto.codigo}`);
    }
    const tiposOperacion = await this.prisma.tipoOperacion.count({ where: { idConcepto: id } });
    if (tiposOperacion > 0) {
      const record = await this.prisma.concepto.findUnique({ where: { id } });
      if (record && (dto as any).tipoTarifa !== undefined && (dto as any).tipoTarifa !== record.tipoTarifa) {
        throw new BadRequestException('No se puede cambiar tipoTarifa porque el concepto tiene tipos de operación asociados');
      }
    }
    return this.prisma.concepto.update({ where: { id }, data: dto as any });
  }

  async removeConcepto(id: number) {
    await this.findOneConcepto(id);
    const tiposOperacion = await this.prisma.tipoOperacion.count({ where: { idConcepto: id } });
    if (tiposOperacion > 0) throw new BadRequestException('No se puede eliminar el concepto porque tiene tipos de operación asociados');
    const tarifas = await this.prisma.tarifaOperacion.count({ where: { idTipoOperacion: id } });
    if (tarifas > 0) throw new BadRequestException('No se puede eliminar el concepto porque tiene tarifas de operación asociadas');
    return this.prisma.concepto.delete({ where: { id } });
  }

  // ============================================================
  // GRUPO CONCEPTO
  // ============================================================

  async findAllGruposConcepto() {
    return this.prisma.grupoConcepto.findMany({ orderBy: { id: 'asc' } });
  }

  async findOneGrupoConcepto(id: number) {
    const record = await this.prisma.grupoConcepto.findUnique({ where: { id } });
    if (!record) throw new NotFoundException(`Grupo de concepto con ID ${id} no encontrado`);
    return record;
  }

  async createGrupoConcepto(dto: CreateGrupoConceptoDto) {
    const existente = await this.prisma.grupoConcepto.findFirst({ where: { codigo: dto.codigo } });
    if (existente) throw new BadRequestException(`Ya existe un grupo de concepto con código ${dto.codigo}`);
    return this.prisma.grupoConcepto.create({ data: dto });
  }

  async updateGrupoConcepto(id: number, dto: UpdateGrupoConceptoDto) {
    await this.findOneGrupoConcepto(id);
    if (dto.codigo) {
      const existente = await this.prisma.grupoConcepto.findFirst({ where: { codigo: dto.codigo, NOT: { id } } });
      if (existente) throw new BadRequestException(`Ya existe un grupo de concepto con código ${dto.codigo}`);
    }
    return this.prisma.grupoConcepto.update({ where: { id }, data: dto });
  }

  async removeGrupoConcepto(id: number) {
    await this.findOneGrupoConcepto(id);
    const conceptos = await this.prisma.concepto.count({ where: { idGrupoConcepto: id } });
    if (conceptos > 0) throw new BadRequestException('No se puede eliminar el grupo porque tiene conceptos asociados');
    return this.prisma.grupoConcepto.delete({ where: { id } });
  }

  // ============================================================
  // TIPO OPERACION
  // ============================================================

  async findAllTiposOperacion(query?: { idConcepto?: string; tipoTarifa?: string }) {
    const where: Prisma.TipoOperacionWhereInput = {};
    if (query?.idConcepto) {
      where.idConcepto = parseInt(query.idConcepto, 10);
    }
    if (query?.tipoTarifa) {
      where.tipoTarifa = parseInt(query.tipoTarifa, 10);
    }
    return this.prisma.tipoOperacion.findMany({ where, orderBy: { id: 'asc' } });
  }

  async findOneTipoOperacion(id: number) {
    const record = await this.prisma.tipoOperacion.findUnique({ where: { id } });
    if (!record) throw new NotFoundException(`Tipo de operación con ID ${id} no encontrado`);
    return record;
  }

  async createTipoOperacion(dto: CreateTipoOperacionDto) {
    const concepto = await this.prisma.concepto.findUnique({ where: { id: dto.idConcepto } });
    if (!concepto) throw new BadRequestException(`Concepto con ID ${dto.idConcepto} no existe`);
    const existente = await this.prisma.tipoOperacion.findFirst({ where: { codigo: dto.codigo } });
    if (existente) throw new BadRequestException(`Ya existe un tipo de operación con código ${dto.codigo}`);
    return this.prisma.tipoOperacion.create({ data: dto });
  }

  async updateTipoOperacion(id: number, dto: UpdateTipoOperacionDto) {
    await this.findOneTipoOperacion(id);
    if (dto.idConcepto) {
      const concepto = await this.prisma.concepto.findUnique({ where: { id: dto.idConcepto } });
      if (!concepto) throw new BadRequestException(`Concepto con ID ${dto.idConcepto} no existe`);
    }
    if (dto.codigo) {
      const existente = await this.prisma.tipoOperacion.findFirst({ where: { codigo: dto.codigo, NOT: { id } } });
      if (existente) throw new BadRequestException(`Ya existe un tipo de operación con código ${dto.codigo}`);
    }
    return this.prisma.tipoOperacion.update({ where: { id }, data: dto });
  }

  async removeTipoOperacion(id: number) {
    await this.findOneTipoOperacion(id);
    const tarifas = await this.prisma.tarifaOperacion.count({ where: { idTipoOperacion: id } });
    if (tarifas > 0) throw new BadRequestException('No se puede eliminar el tipo de operación porque tiene tarifas de operación asociadas');
    return this.prisma.tipoOperacion.delete({ where: { id } });
  }

  // ============================================================
  // TARIFA OPERACION
  // ============================================================

  async findAllTarifasOperacion(query?: {
    idTipoOperacion?: string;
    idAeropuerto?: string;
    rango?: string;
  }) {
    const where: Prisma.TarifaOperacionWhereInput = {};
    if (query?.idTipoOperacion) {
      where.idTipoOperacion = parseInt(query.idTipoOperacion, 10);
    }
    if (query?.idAeropuerto) {
      where.idAeropuerto = parseInt(query.idAeropuerto, 10);
    }
    if (query?.rango) {
      where.rango = query.rango;
    }
    return this.prisma.tarifaOperacion.findMany({ where, orderBy: { id: 'asc' } });
  }

  async findOneTarifaOperacion(id: number) {
    const record = await this.prisma.tarifaOperacion.findUnique({ where: { id } });
    if (!record) throw new NotFoundException(`Tarifa de operación con ID ${id} no encontrada`);
    return record;
  }

  async createTarifaOperacion(dto: CreateTarifaOperacionDto) {
    const tipoOp = await this.prisma.tipoOperacion.findUnique({ where: { id: dto.idTipoOperacion } });
    if (!tipoOp) throw new BadRequestException(`Tipo de operación con ID ${dto.idTipoOperacion} no existe`);
    if (dto.rango === 'R') {
      if (dto.rangoInicial === undefined || dto.rangoFinal === undefined) {
        throw new BadRequestException('Para rango R (rango), rangoInicial y rangoFinal son requeridos');
      }
      if (dto.rangoInicial >= dto.rangoFinal) {
        throw new BadRequestException('rangoInicial debe ser menor que rangoFinal');
      }
    }
    const existente = await this.prisma.tarifaOperacion.findFirst({ where: { codigo: dto.codigo } });
    if (existente) throw new BadRequestException(`Ya existe una tarifa de operación con código ${dto.codigo}`);
    return this.prisma.tarifaOperacion.create({ data: dto as any });
  }

  async updateTarifaOperacion(id: number, dto: UpdateTarifaOperacionDto) {
    await this.findOneTarifaOperacion(id);
    if (dto.idTipoOperacion) {
      const tipoOp = await this.prisma.tipoOperacion.findUnique({ where: { id: dto.idTipoOperacion } });
      if (!tipoOp) throw new BadRequestException(`Tipo de operación con ID ${dto.idTipoOperacion} no existe`);
    }
    if (dto.codigo) {
      const existente = await this.prisma.tarifaOperacion.findFirst({ where: { codigo: dto.codigo, NOT: { id } } });
      if (existente) throw new BadRequestException(`Ya existe una tarifa de operación con código ${dto.codigo}`);
    }
    return this.prisma.tarifaOperacion.update({ where: { id }, data: dto as any });
  }

  async removeTarifaOperacion(id: number) {
    await this.findOneTarifaOperacion(id);
    const tarifasAerolinea = await this.prisma.tarifaAerolinea.count({ where: { idTarifaOperacion: id } });
    if (tarifasAerolinea > 0) throw new BadRequestException('No se puede eliminar la tarifa de operación porque tiene tarifas de aerolínea asociadas');
    return this.prisma.tarifaOperacion.delete({ where: { id } });
  }

  // ============================================================
  // TARIFA AEROLINEA
  // ============================================================

  async findAllTarifasAerolinea(query?: { idTarifaOperacion?: string; idAerolinea?: string }) {
    const where: Prisma.TarifaAerolineaWhereInput = {};
    if (query?.idTarifaOperacion) {
      where.idTarifaOperacion = parseInt(query.idTarifaOperacion, 10);
    }
    if (query?.idAerolinea) {
      where.idAerolinea = parseInt(query.idAerolinea, 10);
    }
    return this.prisma.tarifaAerolinea.findMany({ where, orderBy: { id: 'asc' } });
  }

  async findOneTarifaAerolinea(id: number) {
    const record = await this.prisma.tarifaAerolinea.findUnique({ where: { id } });
    if (!record) throw new NotFoundException(`Tarifa de aerolínea con ID ${id} no encontrada`);
    return record;
  }

  async createTarifaAerolinea(dto: CreateTarifaAerolineaDto) {
    const tarifaOp = await this.prisma.tarifaOperacion.findUnique({ where: { id: dto.idTarifaOperacion } });
    if (!tarifaOp) throw new BadRequestException(`Tarifa de operación con ID ${dto.idTarifaOperacion} no existe`);
    const existente = await this.prisma.tarifaAerolinea.findFirst({
      where: { idTarifaOperacion: dto.idTarifaOperacion, idAerolinea: dto.idAerolinea },
    });
    if (existente) throw new BadRequestException('Ya existe una tarifa negociada para esta aerolínea y tarifa de operación');
    return this.prisma.tarifaAerolinea.create({ data: dto });
  }

  async updateTarifaAerolinea(id: number, dto: UpdateTarifaAerolineaDto) {
    await this.findOneTarifaAerolinea(id);
    if (dto.idTarifaOperacion) {
      const tarifaOp = await this.prisma.tarifaOperacion.findUnique({ where: { id: dto.idTarifaOperacion } });
      if (!tarifaOp) throw new BadRequestException(`Tarifa de operación con ID ${dto.idTarifaOperacion} no existe`);
    }
    if (dto.idTarifaOperacion || dto.idAerolinea) {
      const current = await this.prisma.tarifaAerolinea.findUnique({ where: { id } });
      const dup = await this.prisma.tarifaAerolinea.findFirst({
        where: {
          idTarifaOperacion: dto.idTarifaOperacion ?? current!.idTarifaOperacion,
          idAerolinea: dto.idAerolinea ?? current!.idAerolinea,
          NOT: { id },
        },
      });
      if (dup) throw new BadRequestException('Ya existe una tarifa negociada para esta aerolínea y tarifa de operación');
    }
    return this.prisma.tarifaAerolinea.update({ where: { id }, data: dto });
  }

  async removeTarifaAerolinea(id: number) {
    await this.findOneTarifaAerolinea(id);
    return this.prisma.tarifaAerolinea.delete({ where: { id } });
  }

  // ============================================================
  // IMPUESTO
  // ============================================================

  async findAllImpuestos() {
    return this.prisma.impuesto.findMany({ orderBy: { codigo: 'asc' } });
  }

  async findOneImpuesto(codigo: string) {
    const record = await this.prisma.impuesto.findUnique({ where: { codigo } });
    if (!record) throw new NotFoundException(`Impuesto con código ${codigo} no encontrado`);
    return record;
  }

  async createImpuesto(dto: CreateImpuestoDto) {
    const existente = await this.prisma.impuesto.findUnique({ where: { codigo: dto.codigo } });
    if (existente) throw new BadRequestException(`Ya existe un impuesto con código ${dto.codigo}`);
    return this.prisma.impuesto.create({ data: dto });
  }

  async updateImpuesto(codigo: string, dto: UpdateImpuestoDto) {
    await this.findOneImpuesto(codigo);
    return this.prisma.impuesto.update({ where: { codigo }, data: dto });
  }

  async removeImpuesto(codigo: string) {
    await this.findOneImpuesto(codigo);
    const conceptos = await this.prisma.concepto.count({ where: { aplicaImpuesto: true } });
    if (conceptos > 0) {
      throw new BadRequestException('No se puede eliminar el impuesto porque está referenciado en conceptos');
    }
    return this.prisma.impuesto.delete({ where: { codigo } });
  }
}
