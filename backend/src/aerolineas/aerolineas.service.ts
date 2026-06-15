import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAerolineaDto } from './dto/create-aerolinea.dto';
import { UpdateAerolineaDto } from './dto/update-aerolinea.dto';
import { CreateAeronaveDto } from './dto/create-aeronave.dto';
import { UpdateAeronaveDto } from './dto/update-aeronave.dto';
import { CreateTipoAeronaveDto } from './dto/create-tipo-aeronave.dto';
import { UpdateTipoAeronaveDto } from './dto/update-tipo-aeronave.dto';
import { CreateFabricanteDto } from './dto/create-fabricante.dto';
import { UpdateFabricanteDto } from './dto/update-fabricante.dto';
import { CreateClaseAviacionDto } from './dto/create-clase-aviacion.dto';
import { UpdateClaseAviacionDto } from './dto/update-clase-aviacion.dto';
import { CreatePersonalAerolineaDto } from './dto/create-personal-aerolinea.dto';
import { UpdatePersonalAerolineaDto } from './dto/update-personal-aerolinea.dto';
import { CreateAerolineaConceptoDto } from './dto/create-aerolinea-concepto.dto';
import { UpdateAerolineaConceptoDto } from './dto/update-aerolinea-concepto.dto';
import { CreateAerolineaConfigDto } from './dto/create-aerolinea-config.dto';
import { UpdateAerolineaConfigDto } from './dto/update-aerolinea-config.dto';

@Injectable()
export class AerolineasService {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================================
  // AEROLINEAS
  // ============================================================

  async findAllAerolineas(query?: {
    activo?: string;
    nacional?: string;
    codigoOACI?: string;
    idCiudad?: string;
    idPais?: string;
  }) {
    const where: Record<string, unknown> = {};
    if (query?.activo !== undefined) where.activo = query.activo === 'true';
    if (query?.nacional !== undefined) where.nacional = query.nacional === 'true';
    if (query?.codigoOACI !== undefined) where.codigoOACI = query.codigoOACI;
    if (query?.idCiudad !== undefined) where.idCiudad = parseInt(query.idCiudad, 10);
    if (query?.idPais !== undefined) where.idPais = parseInt(query.idPais, 10);
    return this.prisma.aerolinea.findMany({
      where,
      orderBy: { id: 'asc' },
    });
  }

  async findOneAerolinea(id: number) {
    const aerolinea = await this.prisma.aerolinea.findUnique({ where: { id } });
    if (!aerolinea) throw new NotFoundException('Aerolínea no encontrada');
    return aerolinea;
  }

  async createAerolinea(dto: CreateAerolineaDto) {
    const existente = await this.prisma.aerolinea.findFirst({
      where: { codigo: dto.codigo },
    });
    if (existente) {
      throw new BadRequestException(`Ya existe una aerolínea con el código ${dto.codigo}`);
    }

    if (dto.idCiudad !== undefined) {
      const ciudad = await this.prisma.ciudad.findUnique({ where: { id: dto.idCiudad } });
      if (!ciudad) throw new BadRequestException('La ciudad especificada no existe');
    }

    if (dto.idPais !== undefined) {
      const pais = await this.prisma.pais.findUnique({ where: { id: dto.idPais } });
      if (!pais) throw new BadRequestException('El país especificado no existe');
    }

    if (dto.tipoAviacion !== undefined) {
      const clase = await this.prisma.claseAviacion.findUnique({ where: { id: dto.tipoAviacion } });
      if (!clase) throw new BadRequestException('La clase de aviación especificada no existe');
    }

    return this.prisma.aerolinea.create({ data: dto });
  }

  async updateAerolinea(id: number, dto: UpdateAerolineaDto) {
    await this.findOneAerolinea(id);

    if (dto.codigo !== undefined) {
      const existente = await this.prisma.aerolinea.findFirst({
        where: { codigo: dto.codigo },
      });
      if (existente && existente.id !== id) {
        throw new BadRequestException(`Ya existe una aerolínea con el código ${dto.codigo}`);
      }
    }

    if (dto.idCiudad !== undefined) {
      const ciudad = await this.prisma.ciudad.findUnique({ where: { id: dto.idCiudad } });
      if (!ciudad) throw new BadRequestException('La ciudad especificada no existe');
    }

    if (dto.idPais !== undefined) {
      const pais = await this.prisma.pais.findUnique({ where: { id: dto.idPais } });
      if (!pais) throw new BadRequestException('El país especificado no existe');
    }

    if (dto.tipoAviacion !== undefined) {
      const clase = await this.prisma.claseAviacion.findUnique({ where: { id: dto.tipoAviacion } });
      if (!clase) throw new BadRequestException('La clase de aviación especificada no existe');
    }

    return this.prisma.aerolinea.update({ where: { id }, data: dto });
  }

  async removeAerolinea(id: number) {
    await this.findOneAerolinea(id);

    const aeronaves = await this.prisma.aeronave.count({ where: { idAerolinea: id } });
    if (aeronaves > 0) {
      throw new BadRequestException('No se puede eliminar la aerolínea porque tiene aeronaves asociadas');
    }

    return this.prisma.aerolinea.delete({ where: { id } });
  }

  // ============================================================
  // AERONAVES
  // ============================================================

  async findAllAeronaves(query?: { idAerolinea?: string; matricula?: string }) {
    const where: Record<string, unknown> = {};
    if (query?.idAerolinea !== undefined) where.idAerolinea = parseInt(query.idAerolinea, 10);
    if (query?.matricula !== undefined) where.matricula = { contains: query.matricula };
    return this.prisma.aeronave.findMany({
      where,
      orderBy: { id: 'asc' },
    });
  }

  async findOneAeronave(id: number) {
    const aeronave = await this.prisma.aeronave.findUnique({ where: { id } });
    if (!aeronave) throw new NotFoundException('Aeronave no encontrada');
    return aeronave;
  }

  async createAeronave(dto: CreateAeronaveDto) {
    const existente = await this.prisma.aeronave.findFirst({
      where: { matricula: dto.matricula },
    });
    if (existente) {
      throw new BadRequestException(`Ya existe una aeronave con la matrícula ${dto.matricula}`);
    }

    const aerolinea = await this.prisma.aerolinea.findUnique({ where: { id: dto.idAerolinea } });
    if (!aerolinea) throw new BadRequestException('La aerolínea especificada no existe');

    const tipo = await this.prisma.tipoAeronave.findUnique({ where: { id: dto.idTipoAeronave } });
    if (!tipo) throw new BadRequestException('El tipo de aeronave especificado no existe');

    const clase = await this.prisma.claseAviacion.findUnique({ where: { id: dto.aviacion } });
    if (!clase) throw new BadRequestException('La clase de aviación especificada no existe');

    return this.prisma.aeronave.create({ data: dto });
  }

  async updateAeronave(id: number, dto: UpdateAeronaveDto) {
    await this.findOneAeronave(id);

    if (dto.matricula !== undefined) {
      const existente = await this.prisma.aeronave.findFirst({
        where: { matricula: dto.matricula },
      });
      if (existente && existente.id !== id) {
        throw new BadRequestException(`Ya existe una aeronave con la matrícula ${dto.matricula}`);
      }
    }

    if (dto.idAerolinea !== undefined) {
      const aerolinea = await this.prisma.aerolinea.findUnique({ where: { id: dto.idAerolinea } });
      if (!aerolinea) throw new BadRequestException('La aerolínea especificada no existe');
    }

    if (dto.idTipoAeronave !== undefined) {
      const tipo = await this.prisma.tipoAeronave.findUnique({ where: { id: dto.idTipoAeronave } });
      if (!tipo) throw new BadRequestException('El tipo de aeronave especificado no existe');
    }

    if (dto.aviacion !== undefined) {
      const clase = await this.prisma.claseAviacion.findUnique({ where: { id: dto.aviacion } });
      if (!clase) throw new BadRequestException('La clase de aviación especificada no existe');
    }

    return this.prisma.aeronave.update({ where: { id }, data: dto });
  }

  async removeAeronave(id: number) {
    await this.findOneAeronave(id);

    const operaciones = await this.prisma.itinerario.count({
      where: { matricula: (await this.prisma.aeronave.findUnique({ where: { id } }))?.matricula },
    });
    if (operaciones > 0) {
      throw new BadRequestException('No se puede eliminar la aeronave porque tiene operaciones asociadas');
    }

    return this.prisma.aeronave.delete({ where: { id } });
  }

  // ============================================================
  // TIPOS AERONAVE
  // ============================================================

  async findAllTiposAeronave(query?: { idFabricante?: string }) {
    const where: Record<string, unknown> = {};
    if (query?.idFabricante !== undefined) where.idFabricante = parseInt(query.idFabricante, 10);
    return this.prisma.tipoAeronave.findMany({
      where,
      orderBy: { id: 'asc' },
    });
  }

  async findOneTipoAeronave(id: number) {
    const tipo = await this.prisma.tipoAeronave.findUnique({ where: { id } });
    if (!tipo) throw new NotFoundException('Tipo de aeronave no encontrado');
    return tipo;
  }

  async createTipoAeronave(dto: CreateTipoAeronaveDto) {
    if (dto.idFabricante !== undefined) {
      const fabricante = await this.prisma.fabricante.findUnique({ where: { id: dto.idFabricante } });
      if (!fabricante) throw new BadRequestException('El fabricante especificado no existe');
    }
    return this.prisma.tipoAeronave.create({ data: dto });
  }

  async updateTipoAeronave(id: number, dto: UpdateTipoAeronaveDto) {
    await this.findOneTipoAeronave(id);

    if (dto.idFabricante !== undefined) {
      const fabricante = await this.prisma.fabricante.findUnique({ where: { id: dto.idFabricante } });
      if (!fabricante) throw new BadRequestException('El fabricante especificado no existe');
    }

    return this.prisma.tipoAeronave.update({ where: { id }, data: dto });
  }

  async removeTipoAeronave(id: number) {
    await this.findOneTipoAeronave(id);

    const aeronaves = await this.prisma.aeronave.count({ where: { idTipoAeronave: id } });
    if (aeronaves > 0) {
      throw new BadRequestException('No se puede eliminar el tipo de aeronave porque tiene aeronaves asociadas');
    }

    return this.prisma.tipoAeronave.delete({ where: { id } });
  }

  // ============================================================
  // FABRICANTES
  // ============================================================

  async findAllFabricantes() {
    return this.prisma.fabricante.findMany({ orderBy: { id: 'asc' } });
  }

  async findOneFabricante(id: number) {
    const fabricante = await this.prisma.fabricante.findUnique({ where: { id } });
    if (!fabricante) throw new NotFoundException('Fabricante no encontrado');
    return fabricante;
  }

  async createFabricante(dto: CreateFabricanteDto) {
    return this.prisma.fabricante.create({ data: dto });
  }

  async updateFabricante(id: number, dto: UpdateFabricanteDto) {
    await this.findOneFabricante(id);
    return this.prisma.fabricante.update({ where: { id }, data: dto });
  }

  async removeFabricante(id: number) {
    await this.findOneFabricante(id);

    const tipos = await this.prisma.tipoAeronave.count({ where: { idFabricante: id } });
    if (tipos > 0) {
      throw new BadRequestException('No se puede eliminar el fabricante porque tiene tipos de aeronave asociados');
    }

    return this.prisma.fabricante.delete({ where: { id } });
  }

  // ============================================================
  // CLASES AVIACION
  // ============================================================

  async findAllClasesAviacion() {
    return this.prisma.claseAviacion.findMany({ orderBy: { id: 'asc' } });
  }

  async findOneClaseAviacion(id: number) {
    const clase = await this.prisma.claseAviacion.findUnique({ where: { id } });
    if (!clase) throw new NotFoundException('Clase de aviación no encontrada');
    return clase;
  }

  async createClaseAviacion(dto: CreateClaseAviacionDto) {
    if (dto.claseSuperior !== undefined) {
      const superior = await this.prisma.claseAviacion.findUnique({ where: { id: dto.claseSuperior } });
      if (!superior) throw new BadRequestException('La clase de aviación superior especificada no existe');
    }
    return this.prisma.claseAviacion.create({ data: dto });
  }

  async updateClaseAviacion(id: number, dto: UpdateClaseAviacionDto) {
    await this.findOneClaseAviacion(id);

    if (dto.claseSuperior !== undefined) {
      const superior = await this.prisma.claseAviacion.findUnique({ where: { id: dto.claseSuperior } });
      if (!superior) throw new BadRequestException('La clase de aviación superior especificada no existe');
    }

    return this.prisma.claseAviacion.update({ where: { id }, data: dto });
  }

  async removeClaseAviacion(id: number) {
    await this.findOneClaseAviacion(id);

    const aerolineas = await this.prisma.aerolinea.count({ where: { tipoAviacion: id } });
    if (aerolineas > 0) {
      throw new BadRequestException('No se puede eliminar la clase de aviación porque tiene aerolíneas asociadas');
    }

    return this.prisma.claseAviacion.delete({ where: { id } });
  }

  // ============================================================
  // PERSONAL AEROLINEA
  // ============================================================

  async findAllPersonalAerolinea(query?: { idAerolinea?: string }) {
    const where: Record<string, unknown> = {};
    if (query?.idAerolinea !== undefined) where.idAerolinea = parseInt(query.idAerolinea, 10);
    return this.prisma.personalAerolinea.findMany({
      where,
      orderBy: { id: 'asc' },
    });
  }

  async findOnePersonalAerolinea(id: number) {
    const personal = await this.prisma.personalAerolinea.findUnique({ where: { id } });
    if (!personal) throw new NotFoundException('Personal de aerolínea no encontrado');
    return personal;
  }

  async createPersonalAerolinea(dto: CreatePersonalAerolineaDto) {
    if (dto.idAerolinea !== undefined) {
      const aerolinea = await this.prisma.aerolinea.findUnique({ where: { id: dto.idAerolinea } });
      if (!aerolinea) throw new BadRequestException('La aerolínea especificada no existe');
    }
    return this.prisma.personalAerolinea.create({ data: dto });
  }

  async updatePersonalAerolinea(id: number, dto: UpdatePersonalAerolineaDto) {
    await this.findOnePersonalAerolinea(id);

    if (dto.idAerolinea !== undefined) {
      const aerolinea = await this.prisma.aerolinea.findUnique({ where: { id: dto.idAerolinea } });
      if (!aerolinea) throw new BadRequestException('La aerolínea especificada no existe');
    }

    return this.prisma.personalAerolinea.update({ where: { id }, data: dto });
  }

  async removePersonalAerolinea(id: number) {
    await this.findOnePersonalAerolinea(id);
    return this.prisma.personalAerolinea.delete({ where: { id } });
  }

  // ============================================================
  // AEROLINEA CONCEPTOS
  // ============================================================

  async findAllAerolineasConceptos() {
    return this.prisma.aerolineaConcepto.findMany({ orderBy: { id: 'asc' } });
  }

  async findOneAerolineaConcepto(id: number) {
    const rel = await this.prisma.aerolineaConcepto.findUnique({ where: { id } });
    if (!rel) throw new NotFoundException('Relación aerolínea-concepto no encontrada');
    return rel;
  }

  async createAerolineaConcepto(dto: CreateAerolineaConceptoDto) {
    const concepto = await this.prisma.concepto.findUnique({ where: { id: dto.idConcepto } });
    if (!concepto) throw new BadRequestException('El concepto especificado no existe');

    const aerolinea = await this.prisma.aerolinea.findUnique({ where: { id: dto.idAerolinea } });
    if (!aerolinea) throw new BadRequestException('La aerolínea especificada no existe');

    return this.prisma.aerolineaConcepto.create({ data: dto });
  }

  async updateAerolineaConcepto(id: number, dto: UpdateAerolineaConceptoDto) {
    await this.findOneAerolineaConcepto(id);

    if (dto.idConcepto !== undefined) {
      const concepto = await this.prisma.concepto.findUnique({ where: { id: dto.idConcepto } });
      if (!concepto) throw new BadRequestException('El concepto especificado no existe');
    }

    if (dto.idAerolinea !== undefined) {
      const aerolinea = await this.prisma.aerolinea.findUnique({ where: { id: dto.idAerolinea } });
      if (!aerolinea) throw new BadRequestException('La aerolínea especificada no existe');
    }

    return this.prisma.aerolineaConcepto.update({ where: { id }, data: dto });
  }

  async removeAerolineaConcepto(id: number) {
    await this.findOneAerolineaConcepto(id);
    return this.prisma.aerolineaConcepto.delete({ where: { id } });
  }

  // ============================================================
  // AEROLINEA CONFIG
  // ============================================================

  async findAllAerolineasConfig() {
    return this.prisma.aerolineaConfig.findMany({ orderBy: { id: 'asc' } });
  }

  async findOneAerolineaConfig(id: number) {
    const config = await this.prisma.aerolineaConfig.findUnique({ where: { id } });
    if (!config) throw new NotFoundException('Configuración de aerolínea no encontrada');
    return config;
  }

  async createAerolineaConfig(dto: CreateAerolineaConfigDto) {
    const aerolinea = await this.prisma.aerolinea.findUnique({ where: { id: dto.idAerolinea } });
    if (!aerolinea) throw new BadRequestException('La aerolínea especificada no existe');

    const aeropuerto = await this.prisma.aeropuerto.findUnique({ where: { id: dto.idAeropuerto } });
    if (!aeropuerto) throw new BadRequestException('El aeropuerto especificado no existe');

    return this.prisma.aerolineaConfig.create({ data: dto });
  }

  async updateAerolineaConfig(id: number, dto: UpdateAerolineaConfigDto) {
    await this.findOneAerolineaConfig(id);

    if (dto.idAerolinea !== undefined) {
      const aerolinea = await this.prisma.aerolinea.findUnique({ where: { id: dto.idAerolinea } });
      if (!aerolinea) throw new BadRequestException('La aerolínea especificada no existe');
    }

    if (dto.idAeropuerto !== undefined) {
      const aeropuerto = await this.prisma.aeropuerto.findUnique({ where: { id: dto.idAeropuerto } });
      if (!aeropuerto) throw new BadRequestException('El aeropuerto especificado no existe');
    }

    return this.prisma.aerolineaConfig.update({ where: { id }, data: dto });
  }

  async removeAerolineaConfig(id: number) {
    await this.findOneAerolineaConfig(id);
    return this.prisma.aerolineaConfig.delete({ where: { id } });
  }
}
