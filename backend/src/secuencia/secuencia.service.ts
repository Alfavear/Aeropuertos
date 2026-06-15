import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SecuenciaService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerSiguiente(nombre: string, idAeropuerto: number): Promise<{ consecutivo: number }> {
    return this.prisma.$transaction(async (tx) => {
      const secuencia = await tx.secuencia.findUnique({
        where: { nombre_idAeropuerto: { nombre, idAeropuerto } },
      });

      if (!secuencia) {
        throw new NotFoundException(
          `Secuencia '${nombre}' no encontrada para el aeropuerto ${idAeropuerto}`,
        );
      }

      const actualizada = await tx.secuencia.update({
        where: { id: secuencia.id },
        data: { consecutivo: secuencia.consecutivo + 1 },
      });

      return { consecutivo: actualizada.consecutivo };
    });
  }

  async crearSiNoExiste(
    nombre: string,
    idAeropuerto: number,
    inicial = 1,
  ): Promise<{ consecutivo: number; creada: boolean }> {
    const existente = await this.prisma.secuencia.findUnique({
      where: { nombre_idAeropuerto: { nombre, idAeropuerto } },
    });

    if (existente) {
      return { consecutivo: existente.consecutivo, creada: false };
    }

    const creada = await this.prisma.secuencia.create({
      data: { nombre, consecutivo: inicial, idAeropuerto },
    });

    return { consecutivo: creada.consecutivo, creada: true };
  }

  async establecerValor(nombre: string, idAeropuerto: number, valor: number) {
    const secuencia = await this.prisma.secuencia.findUnique({
      where: { nombre_idAeropuerto: { nombre, idAeropuerto } },
    });

    if (!secuencia) {
      throw new NotFoundException(
        `Secuencia '${nombre}' no encontrada para el aeropuerto ${idAeropuerto}`,
      );
    }

    if (valor < secuencia.consecutivo) {
      throw new BadRequestException(
        `El nuevo valor (${valor}) no puede ser menor al actual (${secuencia.consecutivo})`,
      );
    }

    return this.prisma.secuencia.update({
      where: { id: secuencia.id },
      data: { consecutivo: valor },
    });
  }
}
