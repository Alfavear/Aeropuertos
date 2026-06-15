import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReporteDto } from './dto/create-reporte.dto';
import { UpdateReporteDto } from './dto/update-reporte.dto';
import { CreateCategoriaReporteDto } from './dto/create-categoria-reporte.dto';
import { UpdateCategoriaReporteDto } from './dto/update-categoria-reporte.dto';

@Injectable()
export class ReportesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllReportes(query?: { idCategoria?: number }) {
    const where: Record<string, unknown> = {};
    if (query?.idCategoria !== undefined) where.idCategoria = query.idCategoria;
    return this.prisma.reporte.findMany({ where, orderBy: { id: 'asc' } });
  }

  async findOneReporte(id: number) {
    const reporte = await this.prisma.reporte.findUnique({ where: { id } });
    if (!reporte) throw new NotFoundException('Reporte no encontrado');
    return reporte;
  }

  async createReporte(dto: CreateReporteDto) {
    const existente = await this.prisma.reporte.findFirst({
      where: { codigo: dto.codigo },
    });
    if (existente) {
      throw new BadRequestException(`Ya existe un reporte con el código ${dto.codigo}`);
    }

    if (dto.idCategoria !== undefined) {
      const categoria = await this.prisma.categoriaReporte.findUnique({
        where: { id: dto.idCategoria },
      });
      if (!categoria) {
        throw new BadRequestException('La categoría especificada no existe');
      }
    }

    return this.prisma.reporte.create({ data: dto });
  }

  async updateReporte(id: number, dto: UpdateReporteDto) {
    await this.findOneReporte(id);

    if (dto.codigo !== undefined) {
      const existente = await this.prisma.reporte.findFirst({
        where: { codigo: dto.codigo },
      });
      if (existente && existente.id !== id) {
        throw new BadRequestException(`Ya existe un reporte con el código ${dto.codigo}`);
      }
    }

    if (dto.idCategoria !== undefined) {
      const categoria = await this.prisma.categoriaReporte.findUnique({
        where: { id: dto.idCategoria },
      });
      if (!categoria) {
        throw new BadRequestException('La categoría especificada no existe');
      }
    }

    return this.prisma.reporte.update({ where: { id }, data: dto });
  }

  async removeReporte(id: number) {
    await this.findOneReporte(id);
    return this.prisma.reporte.delete({ where: { id } });
  }

  async findAllCategorias() {
    return this.prisma.categoriaReporte.findMany({ orderBy: { id: 'asc' } });
  }

  async findOneCategoria(id: number) {
    const categoria = await this.prisma.categoriaReporte.findUnique({
      where: { id },
    });
    if (!categoria) throw new NotFoundException('Categoría de reporte no encontrada');
    return categoria;
  }

  async createCategoria(dto: CreateCategoriaReporteDto) {
    const existente = await this.prisma.categoriaReporte.findFirst({
      where: { nombre: dto.nombre },
    });
    if (existente) {
      throw new BadRequestException(`Ya existe una categoría con el nombre ${dto.nombre}`);
    }
    return this.prisma.categoriaReporte.create({ data: dto });
  }

  async updateCategoria(id: number, dto: UpdateCategoriaReporteDto) {
    await this.findOneCategoria(id);

    if (dto.nombre !== undefined) {
      const existente = await this.prisma.categoriaReporte.findFirst({
        where: { nombre: dto.nombre },
      });
      if (existente && existente.id !== id) {
        throw new BadRequestException(`Ya existe una categoría con el nombre ${dto.nombre}`);
      }
    }

    return this.prisma.categoriaReporte.update({ where: { id }, data: dto });
  }

  async removeCategoria(id: number) {
    await this.findOneCategoria(id);

    const reportes = await this.prisma.reporte.count({
      where: { idCategoria: id },
    });
    if (reportes > 0) {
      throw new BadRequestException(
        'No se puede eliminar la categoría porque tiene reportes asociados',
      );
    }

    return this.prisma.categoriaReporte.delete({ where: { id } });
  }
}
