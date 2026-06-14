import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OperacionesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllItinerarios(query?: { skip?: number; take?: number; where?: any }) {
    return this.prisma.itinerario.findMany({
      skip: query?.skip ?? 0,
      take: query?.take ?? 100,
      where: query?.where,
      orderBy: { horaVuelo: 'desc' },
    });
  }

  async findItinerarioById(id: number) {
    const record = await this.prisma.itinerario.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('Itinerario no encontrado');
    return record;
  }

  async createItinerario(data: any) {
    return this.prisma.itinerario.create({ data });
  }

  async updateItinerario(id: number, data: any) {
    await this.findItinerarioById(id);
    return this.prisma.itinerario.update({ where: { id }, data });
  }

  async deleteItinerario(id: number) {
    await this.findItinerarioById(id);
    return this.prisma.itinerario.delete({ where: { id } });
  }

  async findAllVuelos(query?: { skip?: number; take?: number; where?: any }) {
    return this.prisma.vuelo.findMany({
      skip: query?.skip ?? 0,
      take: query?.take ?? 100,
      where: query?.where,
      orderBy: { id: 'asc' },
    });
  }

  async findVueloById(id: number) {
    const record = await this.prisma.vuelo.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('Vuelo no encontrado');
    return record;
  }

  async createVuelo(data: any) {
    return this.prisma.vuelo.create({ data });
  }

  async updateVuelo(id: number, data: any) {
    await this.findVueloById(id);
    return this.prisma.vuelo.update({ where: { id }, data });
  }

  async deleteVuelo(id: number) {
    await this.findVueloById(id);
    return this.prisma.vuelo.delete({ where: { id } });
  }

  async findAllPuertas(query?: { skip?: number; take?: number; where?: any }) {
    return this.prisma.puertaEmbarque.findMany({
      skip: query?.skip ?? 0,
      take: query?.take ?? 100,
      where: { activo: true, ...query?.where },
      orderBy: { codigo: 'asc' },
    });
  }

  async findAllHangares(query?: { skip?: number; take?: number; where?: any }) {
    return this.prisma.hangar.findMany({
      skip: query?.skip ?? 0,
      take: query?.take ?? 100,
      where: query?.where,
      orderBy: { codigo: 'asc' },
    });
  }
}
