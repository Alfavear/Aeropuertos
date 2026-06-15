import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.prisma.usuario.findUnique({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.activo) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    const bloqueo = await this.validarBloqueo(user.id);
    if (bloqueo.bloqueado) {
      throw new UnauthorizedException(bloqueo.mensaje);
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      const nuevosIntentos = (user.intentosFallidos ?? 0) + 1;

      const paramIntentos = await this.prisma.parametroSistema.findUnique({
        where: { codigo: 'INTENTOS_FALLIDOS' },
      });
      const maxIntentos = paramIntentos ? parseInt(paramIntentos.valor ?? '9', 10) : 9;

      await this.prisma.usuario.update({
        where: { id: user.id },
        data: {
          intentosFallidos: nuevosIntentos,
          bloqueado: nuevosIntentos >= maxIntentos,
        },
      });

      throw new UnauthorizedException('Credenciales inválidas');
    }

    if ((user.intentosFallidos ?? 0) > 0) {
      await this.prisma.usuario.update({
        where: { id: user.id },
        data: { intentosFallidos: 0, ultimoAcceso: new Date() },
      });
    } else {
      await this.prisma.usuario.update({
        where: { id: user.id },
        data: { ultimoAcceso: new Date() },
      });
    }

    const perfil = user.idPerfil
      ? await this.prisma.perfil.findUnique({ where: { id: user.idPerfil } })
      : null;

    const aeropuertos = await this.prisma.accesoAeropuerto.findMany({
      where: { idUsuario: user.id, activo: true },
      include: { aeropuerto: { select: { id: true, codigo: true, nombre: true } } },
    });

    const necesitaCambioPass = user.debeCambiarPass;

    const idAeropuertoActivo = aeropuertos.length === 1 ? aeropuertos[0].idAeropuerto : undefined;

    const payload = { sub: user.id, username: user.username, idAeropuertoActivo };

    return {
      token: this.jwtService.sign(payload),
      necesitaCambioPass,
      necesitaSeleccionarAeropuerto: aeropuertos.length > 1 && !user.debeCambiarPass,
      aeropuertos: aeropuertos.map((a) => ({
        id: a.idAeropuerto,
        codigo: a.aeropuerto.codigo,
        nombre: a.aeropuerto.nombre,
        permisos: {
          cambiarAeropuerto: a.cambiarAeropuerto,
          cambiarFechaFact: a.cambiarFechaFact,
          cambiarFuente: a.cambiarFuente,
          cambiarSerie: a.cambiarSerie,
          administradorPeriodos: a.administradorPeriodos,
          controlaTasas: a.controlaTasas,
          permitirReversiones: a.permitirReversiones,
          habilOperInter: a.habilOperInter,
        },
      })),
      user: {
        id: user.id,
        username: user.username,
        nombre: user.nombre,
        email: user.email,
        telefono: user.telefono,
        perfil: perfil ? { id: perfil.id, codigo: perfil.codigo, nombre: perfil.nombre } : null,
      },
    };
  }

  async seleccionarAeropuerto(userId: number, idAeropuerto: number) {
    const acceso = await this.prisma.accesoAeropuerto.findUnique({
      where: { idUsuario_idAeropuerto: { idUsuario: userId, idAeropuerto } },
      include: { aeropuerto: { select: { id: true, codigo: true, nombre: true } } },
    });

    if (!acceso || !acceso.activo) {
      throw new BadRequestException('No tiene acceso a este aeropuerto');
    }

    const user = await this.prisma.usuario.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();

    const payload = { sub: user.id, username: user.username, idAeropuertoActivo: idAeropuerto };

    return {
      token: this.jwtService.sign(payload),
      aeropuertoActivo: {
        id: acceso.idAeropuerto,
        codigo: acceso.aeropuerto.codigo,
        nombre: acceso.aeropuerto.nombre,
      },
    };
  }

  private async validarBloqueo(id: number) {
    const user = await this.prisma.usuario.findUnique({ where: { id } });
    if (!user) return { bloqueado: false, mensaje: null };

    if (user.bloqueoSevero) {
      return { bloqueado: true, mensaje: 'El usuario se encuentra bloqueado por seguridad.' };
    }
    if (user.bloqueoMovimiento) {
      return { bloqueado: true, mensaje: 'El usuario se encuentra bloqueado por movimiento.' };
    }
    if (user.bloqueoProgramado && user.fechaInicioBloqueo && user.fechaInicioBloqueo <= new Date()) {
      await this.prisma.usuario.update({
        where: { id },
        data: { bloqueado: true },
      });
      return { bloqueado: true, mensaje: 'El usuario se encuentra bloqueado por restricción programada.' };
    }

    const paramIntentos = await this.prisma.parametroSistema.findUnique({
      where: { codigo: 'INTENTOS_FALLIDOS' },
    });
    const maxIntentos = paramIntentos ? parseInt(paramIntentos.valor ?? '9', 10) : 9;

    if (user.bloqueado && (user.intentosFallidos ?? 0) >= maxIntentos) {
      return { bloqueado: true, mensaje: 'Usuario bloqueado por intentos fallidos. Contacte al administrador.' };
    }

    if (user.fechaVence && new Date(user.fechaVence) < new Date()) {
      return { bloqueado: true, mensaje: 'La cuenta ha expirado. Contacte al administrador.' };
    }

    return { bloqueado: false, mensaje: null };
  }
}
