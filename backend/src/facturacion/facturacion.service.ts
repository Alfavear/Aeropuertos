import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FacturacionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllFacturas(query?: { skip?: number; take?: number; where?: any }) {
    return this.prisma.factura.findMany({
      skip: query?.skip ?? 0,
      take: query?.take ?? 100,
      where: query?.where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findFacturaById(id: number) {
    const record = await this.prisma.factura.findUnique({
      where: { id },
    });
    if (!record) throw new NotFoundException('Factura no encontrada');
    return record;
  }

  async createFactura(data: any) {
    return this.prisma.factura.create({ data });
  }

  async updateFactura(id: number, data: any) {
    await this.findFacturaById(id);
    return this.prisma.factura.update({ where: { id }, data });
  }

  async deleteFactura(id: number) {
    await this.findFacturaById(id);
    return this.prisma.factura.delete({ where: { id } });
  }

  async findAllMovimientos(query?: { skip?: number; take?: number; where?: any }) {
    return this.prisma.movimientoFacturacion.findMany({
      skip: query?.skip ?? 0,
      take: query?.take ?? 100,
      where: query?.where,
      orderBy: { fecha: 'desc' },
    });
  }
}
