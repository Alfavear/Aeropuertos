import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SeguridadService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllUsuarios(query?: { skip?: number; take?: number }) {
    return this.prisma.usuario.findMany({
      skip: query?.skip ?? 0,
      take: query?.take ?? 100,
      orderBy: { id: 'asc' },
      select: {
        id: true,
        username: true,
        nombre: true,
        email: true,
        activo: true,
        bloqueado: true,
        ultimoAcceso: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findUsuarioById(id: number) {
    const user = await this.prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        nombre: true,
        email: true,
        activo: true,
        bloqueado: true,
        ultimoAcceso: true,
        intentosFallidos: true,
        fechaVence: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async createUsuario(data: { username: string; password: string; nombre?: string; email?: string; idPerfil?: number }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.usuario.create({
      data: {
        username: data.username,
        password: hashedPassword,
        nombre: data.nombre,
        email: data.email,
        idPerfil: data.idPerfil,
        activo: true,
        bloqueado: false,
      },
      select: {
        id: true,
        username: true,
        nombre: true,
        email: true,
        activo: true,
        createdAt: true,
      },
    });
  }

  async updateUsuario(id: number, data: { nombre?: string; email?: string; activo?: boolean; bloqueado?: boolean; password?: string }) {
    await this.findUsuarioById(id);
    const updateData: any = { ...data };
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }
    return this.prisma.usuario.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        nombre: true,
        email: true,
        activo: true,
        bloqueado: true,
        updatedAt: true,
      },
    });
  }

  async deleteUsuario(id: number) {
    await this.findUsuarioById(id);
    return this.prisma.usuario.delete({ where: { id } });
  }

  async findAllPerfiles() {
    return this.prisma.perfil.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findPerfilById(id: number) {
    const perfil = await this.prisma.perfil.findUnique({
      where: { id },
    });
    if (!perfil) throw new NotFoundException('Perfil no encontrado');
    return perfil;
  }

  async createPerfil(data: { codigo: string; nombre: string; descripcion?: string }) {
    return this.prisma.perfil.create({
      data: { ...data, activo: true },
    });
  }

  async updatePerfil(id: number, data: { codigo?: string; nombre?: string; descripcion?: string; activo?: boolean }) {
    await this.findPerfilById(id);
    return this.prisma.perfil.update({
      where: { id },
      data,
    });
  }

  async deletePerfil(id: number) {
    await this.findPerfilById(id);
    return this.prisma.perfil.delete({ where: { id } });
  }

  async findMenuOpciones() {
    return this.prisma.menuOpcion.findMany({
      where: { activo: true },
      orderBy: { orden: 'asc' },
    });
  }
}
