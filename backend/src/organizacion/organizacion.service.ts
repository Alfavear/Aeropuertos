import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaisDto } from './dto/create-pais.dto';
import { UpdatePaisDto } from './dto/update-pais.dto';
import { CreateCiudadDto } from './dto/create-ciudad.dto';
import { UpdateCiudadDto } from './dto/update-ciudad.dto';
import { CreateAeropuertoDto } from './dto/create-aeropuerto.dto';
import { UpdateAeropuertoDto } from './dto/update-aeropuerto.dto';
import { CreateZonaDto } from './dto/create-zona.dto';
import { UpdateZonaDto } from './dto/update-zona.dto';
import { CreateZonaAeropuertoDto } from './dto/create-zona-aeropuerto.dto';
import { UpdateZonaAeropuertoDto } from './dto/update-zona-aeropuerto.dto';
import { CreateHorarioAeropuertoDto } from './dto/create-horario-aeropuerto.dto';
import { UpdateHorarioAeropuertoDto } from './dto/update-horario-aeropuerto.dto';

@Injectable()
export class OrganizacionService {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================================
  // PAISES
  // ============================================================

  async findAllPaises() {
    return this.prisma.pais.findMany({ orderBy: { id: 'asc' } });
  }

  async findOnePais(id: number) {
    const pais = await this.prisma.pais.findUnique({ where: { id } });
    if (!pais) throw new NotFoundException('País no encontrado');
    return pais;
  }

  async createPais(dto: CreatePaisDto) {
    return this.prisma.pais.create({ data: dto });
  }

  async updatePais(id: number, dto: UpdatePaisDto) {
    await this.findOnePais(id);
    return this.prisma.pais.update({ where: { id }, data: dto });
  }

  async removePais(id: number) {
    await this.findOnePais(id);
    const ciudades = await this.prisma.ciudad.count({ where: { idPais: id } });
    if (ciudades > 0) {
      throw new BadRequestException(
        'No se puede eliminar el país porque tiene ciudades asociadas',
      );
    }
    return this.prisma.pais.delete({ where: { id } });
  }

  // ============================================================
  // CIUDADES
  // ============================================================

  async findAllCiudades() {
    return this.prisma.ciudad.findMany({ orderBy: { id: 'asc' } });
  }

  async findOneCiudad(id: number) {
    const ciudad = await this.prisma.ciudad.findUnique({ where: { id } });
    if (!ciudad) throw new NotFoundException('Ciudad no encontrada');
    return ciudad;
  }

  async createCiudad(dto: CreateCiudadDto) {
    const pais = await this.prisma.pais.findUnique({
      where: { id: dto.idPais },
    });
    if (!pais) throw new BadRequestException('El país especificado no existe');
    return this.prisma.ciudad.create({ data: dto });
  }

  async updateCiudad(id: number, dto: UpdateCiudadDto) {
    await this.findOneCiudad(id);
    if (dto.idPais !== undefined) {
      const pais = await this.prisma.pais.findUnique({
        where: { id: dto.idPais },
      });
      if (!pais)
        throw new BadRequestException('El país especificado no existe');
    }
    return this.prisma.ciudad.update({ where: { id }, data: dto });
  }

  async removeCiudad(id: number) {
    await this.findOneCiudad(id);
    const aeropuertos = await this.prisma.aeropuerto.count({
      where: { idCiudad: id },
    });
    if (aeropuertos > 0) {
      throw new BadRequestException(
        'No se puede eliminar la ciudad porque tiene aeropuertos asociados',
      );
    }
    return this.prisma.ciudad.delete({ where: { id } });
  }

  // ============================================================
  // AEROPUERTOS
  // ============================================================

  async findAllAeropuertos(filtros?: { idCiudad?: number; idZona?: number }) {
    const where: Record<string, unknown> = {};
    if (filtros?.idCiudad !== undefined) where.idCiudad = filtros.idCiudad;
    if (filtros?.idZona !== undefined) where.idZona = filtros.idZona;
    return this.prisma.aeropuerto.findMany({
      where,
      orderBy: { id: 'asc' },
    });
  }

  async findOneAeropuerto(id: number) {
    const aeropuerto = await this.prisma.aeropuerto.findUnique({
      where: { id },
    });
    if (!aeropuerto)
      throw new NotFoundException('Aeropuerto no encontrado');
    return aeropuerto;
  }

  async createAeropuerto(dto: CreateAeropuertoDto) {
    const existente = await this.prisma.aeropuerto.findUnique({
      where: { codigo: dto.codigo },
    });
    if (existente) {
      throw new BadRequestException(
        `Ya existe un aeropuerto con el código ${dto.codigo}`,
      );
    }

    const ciudad = await this.prisma.ciudad.findUnique({
      where: { id: dto.idCiudad },
    });
    if (!ciudad)
      throw new BadRequestException('La ciudad especificada no existe');

    const zona = await this.prisma.zona.findUnique({
      where: { id: dto.idZona },
    });
    if (!zona)
      throw new BadRequestException('La zona especificada no existe');

    return this.prisma.aeropuerto.create({ data: dto });
  }

  async updateAeropuerto(id: number, dto: UpdateAeropuertoDto) {
    await this.findOneAeropuerto(id);

    if (dto.codigo !== undefined) {
      const existente = await this.prisma.aeropuerto.findUnique({
        where: { codigo: dto.codigo },
      });
      if (existente && existente.id !== id) {
        throw new BadRequestException(
          `Ya existe un aeropuerto con el código ${dto.codigo}`,
        );
      }
    }

    if (dto.idCiudad !== undefined) {
      const ciudad = await this.prisma.ciudad.findUnique({
        where: { id: dto.idCiudad },
      });
      if (!ciudad)
        throw new BadRequestException('La ciudad especificada no existe');
    }

    if (dto.idZona !== undefined) {
      const zona = await this.prisma.zona.findUnique({
        where: { id: dto.idZona },
      });
      if (!zona)
        throw new BadRequestException('La zona especificada no existe');
    }

    return this.prisma.aeropuerto.update({ where: { id }, data: dto });
  }

  async removeAeropuerto(id: number) {
    await this.findOneAeropuerto(id);

    const zonasCount = await this.prisma.zonaAeropuerto.count({
      where: { idAeropuerto: id },
    });
    const horariosCount = await this.prisma.horarioAeropuerto.count({
      where: { idAeropuerto: id },
    });

    if (zonasCount > 0 || horariosCount > 0) {
      throw new BadRequestException(
        'No se puede eliminar el aeropuerto porque tiene zonas u horarios asociados',
      );
    }

    return this.prisma.aeropuerto.delete({ where: { id } });
  }

  // ============================================================
  // ZONAS
  // ============================================================

  async findAllZonas() {
    return this.prisma.zona.findMany({ orderBy: { id: 'asc' } });
  }

  async findOneZona(id: number) {
    const zona = await this.prisma.zona.findUnique({ where: { id } });
    if (!zona) throw new NotFoundException('Zona no encontrada');
    return zona;
  }

  async createZona(dto: CreateZonaDto) {
    return this.prisma.zona.create({ data: dto });
  }

  async updateZona(id: number, dto: UpdateZonaDto) {
    await this.findOneZona(id);
    return this.prisma.zona.update({ where: { id }, data: dto });
  }

  async removeZona(id: number) {
    await this.findOneZona(id);
    const aeropuertos = await this.prisma.aeropuerto.count({
      where: { idZona: id },
    });
    if (aeropuertos > 0) {
      throw new BadRequestException(
        'No se puede eliminar la zona porque tiene aeropuertos asociados',
      );
    }
    return this.prisma.zona.delete({ where: { id } });
  }

  // ============================================================
  // ZONAS AEROPUERTO
  // ============================================================

  async findAllZonasAeropuerto() {
    return this.prisma.zonaAeropuerto.findMany({ orderBy: { id: 'asc' } });
  }

  async findOneZonaAeropuerto(id: number) {
    const zona = await this.prisma.zonaAeropuerto.findUnique({
      where: { id },
    });
    if (!zona)
      throw new NotFoundException('Zona de aeropuerto no encontrada');
    return zona;
  }

  async createZonaAeropuerto(dto: CreateZonaAeropuertoDto) {
    const aeropuerto = await this.prisma.aeropuerto.findUnique({
      where: { id: dto.idAeropuerto },
    });
    if (!aeropuerto)
      throw new BadRequestException('El aeropuerto especificado no existe');
    return this.prisma.zonaAeropuerto.create({ data: dto });
  }

  async updateZonaAeropuerto(id: number, dto: UpdateZonaAeropuertoDto) {
    await this.findOneZonaAeropuerto(id);
    if (dto.idAeropuerto !== undefined) {
      const aeropuerto = await this.prisma.aeropuerto.findUnique({
        where: { id: dto.idAeropuerto },
      });
      if (!aeropuerto)
        throw new BadRequestException('El aeropuerto especificado no existe');
    }
    return this.prisma.zonaAeropuerto.update({ where: { id }, data: dto });
  }

  async removeZonaAeropuerto(id: number) {
    await this.findOneZonaAeropuerto(id);
    return this.prisma.zonaAeropuerto.delete({ where: { id } });
  }

  // ============================================================
  // HORARIOS AEROPUERTO
  // ============================================================

  async findAllHorariosAeropuerto() {
    return this.prisma.horarioAeropuerto.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findOneHorarioAeropuerto(id: number) {
    const horario = await this.prisma.horarioAeropuerto.findUnique({
      where: { id },
    });
    if (!horario)
      throw new NotFoundException('Horario de aeropuerto no encontrado');
    return horario;
  }

  async createHorarioAeropuerto(dto: CreateHorarioAeropuertoDto) {
    const aeropuerto = await this.prisma.aeropuerto.findUnique({
      where: { id: dto.idAeropuerto },
    });
    if (!aeropuerto)
      throw new BadRequestException('El aeropuerto especificado no existe');
    return this.prisma.horarioAeropuerto.create({ data: dto });
  }

  async updateHorarioAeropuerto(id: number, dto: UpdateHorarioAeropuertoDto) {
    await this.findOneHorarioAeropuerto(id);
    if (dto.idAeropuerto !== undefined) {
      const aeropuerto = await this.prisma.aeropuerto.findUnique({
        where: { id: dto.idAeropuerto },
      });
      if (!aeropuerto)
        throw new BadRequestException('El aeropuerto especificado no existe');
    }
    return this.prisma.horarioAeropuerto.update({
      where: { id },
      data: dto,
    });
  }

  async removeHorarioAeropuerto(id: number) {
    await this.findOneHorarioAeropuerto(id);
    return this.prisma.horarioAeropuerto.delete({ where: { id } });
  }
}
