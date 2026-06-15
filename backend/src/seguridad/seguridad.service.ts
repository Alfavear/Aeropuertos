import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { CreatePerfilDto } from './dto/create-perfil.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { CreatePermisoPerfilDto } from './dto/create-permiso-perfil.dto';
import { UpdatePermisoPerfilDto } from './dto/update-permiso-perfil.dto';
import { CreateMenuOpcionDto } from './dto/create-menu-opcion.dto';
import { UpdateMenuOpcionDto } from './dto/update-menu-opcion.dto';
import { CreateSesionUsuarioDto } from './dto/create-sesion-usuario.dto';
import { UpdateSesionUsuarioDto } from './dto/update-sesion-usuario.dto';
import { CreateAccesoAeropuertoDto } from './dto/create-acceso-aeropuerto.dto';
import { UpdateAccesoAeropuertoDto } from './dto/update-acceso-aeropuerto.dto';
import { CreateUsuarioCuentaDto } from './dto/create-usuario-cuenta.dto';
import { UpdateUsuarioCuentaDto } from './dto/update-usuario-cuenta.dto';
import { CambiarPasswordDto } from './dto/cambiar-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { BloquearUsuarioDto } from './dto/bloquear-usuario.dto';

const USUARIO_SELECT = {
  id: true, username: true, nombre: true, email: true, telefono: true,
  activo: true, bloqueado: true, bloqueoProgramado: true, bloqueoMovimiento: true,
  bloqueoSevero: true, fechaInicioBloqueo: true, debeCambiarPass: true,
  ultimoCambioPass: true, idPerfil: true, fechaVence: true, ultimoAcceso: true,
  intentosFallidos: true, createdAt: true, updatedAt: true,
  perfil: { select: { id: true, codigo: true, nombre: true } },
} as const;

@Injectable()
export class SeguridadService {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================================
  // USUARIO
  // ============================================================

  async findAllUsuarios(filtros?: { activo?: string; idPerfil?: string }) {
    const where: Record<string, unknown> = {};
    if (filtros?.activo !== undefined) where.activo = filtros.activo === 'true';
    if (filtros?.idPerfil !== undefined) where.idPerfil = parseInt(filtros.idPerfil, 10);
    return this.prisma.usuario.findMany({
      where,
      orderBy: { id: 'asc' },
      select: USUARIO_SELECT,
    });
  }

  async findUsuarioById(id: number) {
    const user = await this.prisma.usuario.findUnique({
      where: { id },
      select: USUARIO_SELECT,
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async createUsuario(dto: CreateUsuarioDto) {
    const existente = await this.prisma.usuario.findUnique({
      where: { username: dto.username },
    });
    if (existente) {
      throw new BadRequestException(`Ya existe un usuario con el username ${dto.username}`);
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.prisma.usuario.create({
      data: {
        username: dto.username,
        password: hashedPassword,
        nombre: dto.nombre,
        email: dto.email,
        telefono: dto.telefono,
        idPerfil: dto.idPerfil,
        fechaVence: dto.fechaVence ? new Date(dto.fechaVence) : undefined,
        activo: true,
        bloqueado: false,
        debeCambiarPass: false,
      },
      select: USUARIO_SELECT,
    });
  }

  async updateUsuario(id: number, dto: UpdateUsuarioDto) {
    await this.findUsuarioById(id);
    if (dto.username !== undefined) {
      const existente = await this.prisma.usuario.findUnique({
        where: { username: dto.username },
      });
      if (existente && existente.id !== id) {
        throw new BadRequestException(`Ya existe un usuario con el username ${dto.username}`);
      }
    }
    const data: Record<string, unknown> = { ...dto };
    if (dto.password !== undefined) {
      data.password = await bcrypt.hash(dto.password, 10);
    }
    if (dto.fechaVence !== undefined) {
      data.fechaVence = dto.fechaVence ? new Date(dto.fechaVence) : null;
    }
    return this.prisma.usuario.update({
      where: { id },
      data,
      select: USUARIO_SELECT,
    });
  }

  async removeUsuario(id: number) {
    await this.findUsuarioById(id);
    return this.prisma.usuario.update({
      where: { id },
      data: { activo: false },
      select: USUARIO_SELECT,
    });
  }

  // ============================================================
  // CAMBIO / RESETEO DE CONTRASEÑA
  // ============================================================

  async cambiarPassword(id: number, dto: CambiarPasswordDto) {
    const user = await this.prisma.usuario.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const passwordValid = await bcrypt.compare(dto.passwordActual, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('La contraseña actual no es correcta');
    }

    await this.validarHistorialPassword(id, dto.passwordNueva);

    const hashedPassword = await bcrypt.hash(dto.passwordNueva, 10);
    await this.prisma.usuario.update({
      where: { id },
      data: {
        password: hashedPassword,
        debeCambiarPass: false,
        ultimoCambioPass: new Date(),
        intentosFallidos: 0,
      },
    });

    await this.prisma.passwordHistory.create({
      data: { idUsuario: id, password: hashedPassword },
    });

    await this.limpiarHistorialPassword(id);

    return { message: 'Contraseña cambiada exitosamente' };
  }

  async resetPassword(id: number, dto: ResetPasswordDto) {
    const user = await this.prisma.usuario.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    await this.validarHistorialPassword(id, dto.password);

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    await this.prisma.usuario.update({
      where: { id },
      data: {
        password: hashedPassword,
        debeCambiarPass: true,
        ultimoCambioPass: new Date(),
        intentosFallidos: 0,
      },
    });

    await this.prisma.passwordHistory.create({
      data: { idUsuario: id, password: hashedPassword },
    });

    await this.limpiarHistorialPassword(id);

    return { message: 'Contraseña reseteada exitosamente. El usuario deberá cambiarla en el próximo inicio de sesión.' };
  }

  private async validarHistorialPassword(idUsuario: number, newPassword: string) {
    const historial = await this.prisma.passwordHistory.findMany({
      where: { idUsuario },
      orderBy: { createdAt: 'desc' },
      take: 9,
    });

    for (const entry of historial) {
      const match = await bcrypt.compare(newPassword, entry.password);
      if (match) {
        throw new BadRequestException('La contraseña no puede ser igual a las últimas 9 utilizadas.');
      }
    }
  }

  private async limpiarHistorialPassword(idUsuario: number) {
    const historial = await this.prisma.passwordHistory.findMany({
      where: { idUsuario },
      orderBy: { createdAt: 'desc' },
      skip: 9,
    });
    if (historial.length > 0) {
      await this.prisma.passwordHistory.deleteMany({
        where: { id: { in: historial.map((h) => h.id) } },
      });
    }
  }

  // ============================================================
  // BLOQUEO / DESBLOQUEO
  // ============================================================

  async bloquearUsuario(id: number, dto: BloquearUsuarioDto) {
    await this.findUsuarioById(id);
    const data: Record<string, unknown> = {};
    if (dto.bloqueoProgramado !== undefined) data.bloqueoProgramado = dto.bloqueoProgramado;
    if (dto.bloqueoMovimiento !== undefined) data.bloqueoMovimiento = dto.bloqueoMovimiento;
    if (dto.bloqueoSevero !== undefined) data.bloqueoSevero = dto.bloqueoSevero;
    if (dto.fechaInicioBloqueo !== undefined) data.fechaInicioBloqueo = new Date(dto.fechaInicioBloqueo);
    data.bloqueado = dto.bloqueoSevero || dto.bloqueoMovimiento || dto.bloqueoProgramado;
    return this.prisma.usuario.update({
      where: { id },
      data,
      select: USUARIO_SELECT,
    });
  }

  async desbloquearUsuario(id: number) {
    await this.findUsuarioById(id);
    return this.prisma.usuario.update({
      where: { id },
      data: {
        bloqueado: false,
        bloqueoProgramado: false,
        bloqueoMovimiento: false,
        bloqueoSevero: false,
        fechaInicioBloqueo: null,
        intentosFallidos: 0,
      },
      select: USUARIO_SELECT,
    });
  }

  async validarBloqueo(id: number) {
    const user = await this.prisma.usuario.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (user.bloqueoSevero) {
      return { bloqueado: true, tipo: 'SEVERO', mensaje: 'El usuario se encuentra bloqueado por seguridad.' };
    }
    if (user.bloqueoMovimiento) {
      return { bloqueado: true, tipo: 'MOVIMIENTO', mensaje: 'El usuario se encuentra bloqueado por movimiento.' };
    }
    if (user.bloqueoProgramado && user.fechaInicioBloqueo && user.fechaInicioBloqueo <= new Date()) {
      await this.prisma.usuario.update({
        where: { id },
        data: { bloqueado: true },
      });
      return { bloqueado: true, tipo: 'PROGRAMADO', mensaje: 'El bloqueo programado ha iniciado.' };
    }
    if (user.bloqueado && (user.intentosFallidos ?? 0) >= 9) {
      return { bloqueado: true, tipo: 'INTENTOS', mensaje: 'Usuario bloqueado por intentos fallidos.' };
    }

    return { bloqueado: false, tipo: null, mensaje: null };
  }

  // ============================================================
  // REGISTRO DE INTENTOS FALLIDOS
  // ============================================================

  async registrarIntentoFallido(id: number) {
    const user = await this.prisma.usuario.findUnique({ where: { id } });
    if (!user) return;

    const nuevosIntentos = (user.intentosFallidos ?? 0) + 1;
    const data: Record<string, unknown> = { intentosFallidos: nuevosIntentos };

    const paramIntentos = await this.prisma.parametroSistema.findUnique({
      where: { codigo: 'INTENTOS_FALLIDOS' },
    });
    const maxIntentos = paramIntentos ? parseInt(paramIntentos.valor ?? '9', 10) : 9;

    if (nuevosIntentos >= maxIntentos) {
      data.bloqueado = true;
    }

    await this.prisma.usuario.update({ where: { id }, data });
  }

  // ============================================================
  // PERFIL
  // ============================================================

  async findAllPerfiles(filtros?: { activo?: string }) {
    const where: Record<string, unknown> = {};
    if (filtros?.activo !== undefined) where.activo = filtros.activo === 'true';
    const perfiles = await this.prisma.perfil.findMany({
      where,
      orderBy: { id: 'asc' },
      include: { _count: { select: { usuarios: true } } },
    });
    return perfiles.map((p) => ({ ...p, totalUsuarios: p._count.usuarios }));
  }

  async findPerfilById(id: number) {
    const perfil = await this.prisma.perfil.findUnique({
      where: { id },
      include: { _count: { select: { usuarios: true } } },
    });
    if (!perfil) throw new NotFoundException('Perfil no encontrado');
    const { _count, ...data } = perfil;
    return { ...data, totalUsuarios: _count.usuarios };
  }

  async createPerfil(dto: CreatePerfilDto) {
    const existente = await this.prisma.perfil.findFirst({
      where: { codigo: dto.codigo },
    });
    if (existente) {
      throw new BadRequestException(`Ya existe un perfil con el código ${dto.codigo}`);
    }
    return this.prisma.perfil.create({
      data: { ...dto, activo: true },
    });
  }

  async updatePerfil(id: number, dto: UpdatePerfilDto) {
    await this.findPerfilById(id);
    if (dto.codigo !== undefined) {
      const existente = await this.prisma.perfil.findFirst({
        where: { codigo: dto.codigo },
      });
      if (existente && existente.id !== id) {
        throw new BadRequestException(`Ya existe un perfil con el código ${dto.codigo}`);
      }
    }
    return this.prisma.perfil.update({ where: { id }, data: dto });
  }

  async removePerfil(id: number) {
    await this.findPerfilById(id);
    const usuarios = await this.prisma.usuario.count({ where: { idPerfil: id } });
    if (usuarios > 0) {
      throw new BadRequestException('No se puede eliminar el perfil porque tiene usuarios asociados');
    }
    return this.prisma.perfil.delete({ where: { id } });
  }

  // ============================================================
  // PERMISOS DE PERFIL (ASIGNACIÓN DE MENÚS)
  // ============================================================

  async findAllPermisosPerfil(filtros?: { idPerfil?: string }) {
    const where: Record<string, unknown> = {};
    if (filtros?.idPerfil !== undefined) where.idPerfil = parseInt(filtros.idPerfil, 10);
    return this.prisma.permisoPerfil.findMany({ where, orderBy: { id: 'asc' } });
  }

  async findPermisoPerfilById(id: number) {
    const registro = await this.prisma.permisoPerfil.findUnique({ where: { id } });
    if (!registro) throw new NotFoundException('Permiso de perfil no encontrado');
    return registro;
  }

  async createPermisoPerfil(dto: CreatePermisoPerfilDto) {
    const perfil = await this.prisma.perfil.findUnique({ where: { id: dto.idPerfil } });
    if (!perfil) throw new BadRequestException('El perfil especificado no existe');
    return this.prisma.permisoPerfil.create({ data: dto });
  }

  async updatePermisoPerfil(id: number, dto: UpdatePermisoPerfilDto) {
    await this.findPermisoPerfilById(id);
    if (dto.idPerfil !== undefined) {
      const perfil = await this.prisma.perfil.findUnique({ where: { id: dto.idPerfil } });
      if (!perfil) throw new BadRequestException('El perfil especificado no existe');
    }
    return this.prisma.permisoPerfil.update({ where: { id }, data: dto });
  }

  async removePermisoPerfil(id: number) {
    await this.findPermisoPerfilById(id);
    return this.prisma.permisoPerfil.delete({ where: { id } });
  }

  async asignarMenusAPerfil(idPerfil: number, idsMenus: number[]) {
    const perfil = await this.prisma.perfil.findUnique({ where: { id: idPerfil } });
    if (!perfil) throw new BadRequestException('El perfil especificado no existe');

    await this.prisma.permisoPerfil.deleteMany({ where: { idPerfil } });
    if (idsMenus.length > 0) {
      await this.prisma.permisoPerfil.createMany({
        data: idsMenus.map((idMenu) => ({
          idPerfil,
          recurso: `menu:${idMenu}`,
          permiso: 1,
        })),
      });
    }
    return { message: `Permisos actualizados para el perfil ${perfil.nombre}` };
  }

  async obtenerMenusDelPerfil(idPerfil: number) {
    const permisos = await this.prisma.permisoPerfil.findMany({
      where: { idPerfil, recurso: { startsWith: 'menu:' } },
    });
    return permisos.map((p) => parseInt(p.recurso.replace('menu:', ''), 10));
  }

  async obtenerMenuPorPerfil(idPerfil: number) {
    const menuIds = await this.obtenerMenusDelPerfil(idPerfil);
    const todas = await this.prisma.menuOpcion.findMany({
      where: { activo: true },
      orderBy: { orden: 'asc' },
    });

    const params = await this.prisma.parametroSistema.findMany({
      where: { codigo: { in: ['MODULO_TASAS', 'TIPO_INGRESO_TASA', 'HABIL_NOTAS_CONTA', 'HABIL_RECIBO_CAJA', 'HABIL_FACT_FOLIOS', 'HABIL_FACT_TASAS_K', 'HABIL_CIERRE_CAJA', 'HABIL_MSTR_INDICA'] } },
    });
    const paramMap = new Map(params.map((p) => [p.codigo, p.valor ?? 'N']));

    const excluir = new Set<number>();
    if (paramMap.get('MODULO_TASAS') === 'N') {
      [123, 114, 115, 116, 205, 206, 208, 209, 207, 210, 211, 411].forEach((id) => excluir.add(id));
    }
    if (paramMap.get('TIPO_INGRESO_TASA') === 'TV') excluir.add(202);
    if (paramMap.get('HABIL_FACT_TASAS_K') === 'N') excluir.add(415);
    if (paramMap.get('HABIL_RECIBO_CAJA') === 'N') [856, 857, 420].forEach((id) => excluir.add(id));
    if (paramMap.get('HABIL_NOTAS_CONTA') === 'N') excluir.add(412);
    if (paramMap.get('HABIL_FACT_FOLIOS') === 'N') [403, 404, 440].forEach((id) => excluir.add(id));
    if (paramMap.get('HABIL_FACT_FOLIOS') === 'N' && paramMap.get('HABIL_RECIBO_CAJA') === 'N') excluir.add(430);
    if (paramMap.get('HABIL_FACT_FOLIOS') === 'S' && paramMap.get('HABIL_RECIBO_CAJA') === 'N') excluir.add(440);
    if (paramMap.get('HABIL_CIERRE_CAJA') === 'N') excluir.add(407);
    if (paramMap.get('HABIL_MSTR_INDICA') === 'N') excluir.add(130);

    return todas
      .filter((m) => !excluir.has(m.id))
      .map((m) => ({
        ...m,
        permitido: menuIds.includes(m.id),
      }));
  }

  // ============================================================
  // MENU OPCION
  // ============================================================

  async findAllMenuOpciones(filtros?: { idPadre?: string }) {
    const where: Record<string, unknown> = { activo: true };
    if (filtros?.idPadre !== undefined) {
      where.idPadre = filtros.idPadre === 'null' ? null : parseInt(filtros.idPadre, 10);
    }
    return this.prisma.menuOpcion.findMany({
      where,
      orderBy: { orden: 'asc' },
    });
  }

  async findMenuOpcionById(id: number) {
    const opcion = await this.prisma.menuOpcion.findUnique({ where: { id } });
    if (!opcion) throw new NotFoundException('Opción de menú no encontrada');
    return opcion;
  }

  async createMenuOpcion(dto: CreateMenuOpcionDto) {
    if (dto.idPadre !== undefined && dto.idPadre !== null) {
      const padre = await this.prisma.menuOpcion.findUnique({ where: { id: dto.idPadre } });
      if (!padre) throw new BadRequestException('La opción padre especificada no existe');
    }
    return this.prisma.menuOpcion.create({
      data: {
        ...dto,
        activo: dto.activo ?? true,
      },
    });
  }

  async updateMenuOpcion(id: number, dto: UpdateMenuOpcionDto) {
    await this.findMenuOpcionById(id);
    if (dto.idPadre !== undefined && dto.idPadre !== null) {
      const padre = await this.prisma.menuOpcion.findUnique({ where: { id: dto.idPadre } });
      if (!padre) throw new BadRequestException('La opción padre especificada no existe');
    }
    return this.prisma.menuOpcion.update({ where: { id }, data: dto });
  }

  async removeMenuOpcion(id: number) {
    await this.findMenuOpcionById(id);
    const hijos = await this.prisma.menuOpcion.count({ where: { idPadre: id } });
    if (hijos > 0) {
      throw new BadRequestException('No se puede eliminar la opción porque tiene opciones hijas');
    }
    return this.prisma.menuOpcion.update({ where: { id }, data: { activo: false } });
  }

  // ============================================================
  // SESION USUARIO
  // ============================================================

  async findAllSesionesUsuario(filtros?: { idUsuario?: string; idAeropuerto?: string }) {
    const where: Record<string, unknown> = {};
    if (filtros?.idUsuario !== undefined) where.idUsuario = parseInt(filtros.idUsuario, 10);
    if (filtros?.idAeropuerto !== undefined) where.idAeropuerto = parseInt(filtros.idAeropuerto, 10);
    return this.prisma.sesionUsuario.findMany({
      where,
      orderBy: { fecha: 'desc' },
    });
  }

  async findSesionUsuarioById(id: number) {
    const registro = await this.prisma.sesionUsuario.findUnique({ where: { id } });
    if (!registro) throw new NotFoundException('Sesión de usuario no encontrada');
    return registro;
  }

  async createSesionUsuario(dto: CreateSesionUsuarioDto) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id: dto.idUsuario } });
    if (!usuario) throw new BadRequestException('El usuario especificado no existe');
    return this.prisma.sesionUsuario.create({ data: dto });
  }

  async updateSesionUsuario(id: number, dto: UpdateSesionUsuarioDto) {
    await this.findSesionUsuarioById(id);
    if (dto.idUsuario !== undefined) {
      const usuario = await this.prisma.usuario.findUnique({ where: { id: dto.idUsuario } });
      if (!usuario) throw new BadRequestException('El usuario especificado no existe');
    }
    return this.prisma.sesionUsuario.update({ where: { id }, data: dto });
  }

  async removeSesionUsuario(id: number) {
    await this.findSesionUsuarioById(id);
    return this.prisma.sesionUsuario.delete({ where: { id } });
  }

  // ============================================================
  // ACCESO AEROPUERTO (permisos por aeropuerto)
  // ============================================================

  ACCESO_AEROPUERTO_INCLUDE = {
    aeropuerto: { select: { id: true, codigo: true, nombre: true } },
  } as const;

  async findAllAccesosAeropuerto(filtros?: { idUsuario?: string; idAeropuerto?: string; activo?: string }) {
    const where: Record<string, unknown> = {};
    if (filtros?.idUsuario !== undefined) where.idUsuario = parseInt(filtros.idUsuario, 10);
    if (filtros?.idAeropuerto !== undefined) where.idAeropuerto = parseInt(filtros.idAeropuerto, 10);
    if (filtros?.activo !== undefined) where.activo = filtros.activo === 'true';
    return this.prisma.accesoAeropuerto.findMany({
      where,
      include: this.ACCESO_AEROPUERTO_INCLUDE,
      orderBy: { id: 'asc' },
    });
  }

  async findAccesoAeropuertoById(id: number) {
    const registro = await this.prisma.accesoAeropuerto.findUnique({
      where: { id },
      include: this.ACCESO_AEROPUERTO_INCLUDE,
    });
    if (!registro) throw new NotFoundException('Acceso a aeropuerto no encontrado');
    return registro;
  }

  async createAccesoAeropuerto(dto: CreateAccesoAeropuertoDto) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id: dto.idUsuario } });
    if (!usuario) throw new BadRequestException('El usuario especificado no existe');

    const aeropuerto = await this.prisma.aeropuerto.findUnique({ where: { id: dto.idAeropuerto } });
    if (!aeropuerto) throw new BadRequestException('El aeropuerto especificado no existe');

    const existente = await this.prisma.accesoAeropuerto.findUnique({
      where: { idUsuario_idAeropuerto: { idUsuario: dto.idUsuario, idAeropuerto: dto.idAeropuerto } },
    });
    if (existente) {
      throw new BadRequestException('El usuario ya tiene acceso a este aeropuerto');
    }

    return this.prisma.accesoAeropuerto.create({
      data: { ...dto, activo: dto.activo ?? true },
      include: this.ACCESO_AEROPUERTO_INCLUDE,
    });
  }

  async updateAccesoAeropuerto(id: number, dto: UpdateAccesoAeropuertoDto) {
    await this.findAccesoAeropuertoById(id);
    return this.prisma.accesoAeropuerto.update({
      where: { id },
      data: dto,
      include: this.ACCESO_AEROPUERTO_INCLUDE,
    });
  }

  async removeAccesoAeropuerto(id: number) {
    await this.findAccesoAeropuertoById(id);
    return this.prisma.accesoAeropuerto.delete({ where: { id } });
  }

  // ============================================================
  // AEROPUERTOS DEL USUARIO ACTUAL
  // ============================================================

  async findMisAeropuertos(idUsuario: number) {
    return this.prisma.accesoAeropuerto.findMany({
      where: { idUsuario, activo: true },
      include: {
        aeropuerto: { select: { id: true, codigo: true, nombre: true } },
      },
      orderBy: { id: 'asc' },
    });
  }

  async findAccesoAeropuertoByUserAndAirport(idUsuario: number, idAeropuerto: number) {
    const acceso = await this.prisma.accesoAeropuerto.findUnique({
      where: { idUsuario_idAeropuerto: { idUsuario, idAeropuerto } },
      include: this.ACCESO_AEROPUERTO_INCLUDE,
    });
    if (!acceso) throw new NotFoundException('El usuario no tiene acceso a este aeropuerto');
    return acceso;
  }

  // ============================================================
  // USUARIO CUENTA
  // ============================================================

  async findAllUsuariosCuentas(filtros?: { idUsuario?: string }) {
    const where: Record<string, unknown> = {};
    if (filtros?.idUsuario !== undefined) where.idUsuario = parseInt(filtros.idUsuario, 10);
    return this.prisma.usuarioCuenta.findMany({ where, orderBy: { id: 'asc' } });
  }

  async findUsuarioCuentaById(id: number) {
    const registro = await this.prisma.usuarioCuenta.findUnique({ where: { id } });
    if (!registro) throw new NotFoundException('Cuenta de usuario no encontrada');
    return registro;
  }

  async createUsuarioCuenta(dto: CreateUsuarioCuentaDto) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id: dto.idUsuario } });
    if (!usuario) throw new BadRequestException('El usuario especificado no existe');
    return this.prisma.usuarioCuenta.create({ data: dto });
  }

  async updateUsuarioCuenta(id: number, dto: UpdateUsuarioCuentaDto) {
    await this.findUsuarioCuentaById(id);
    if (dto.idUsuario !== undefined) {
      const usuario = await this.prisma.usuario.findUnique({ where: { id: dto.idUsuario } });
      if (!usuario) throw new BadRequestException('El usuario especificado no existe');
    }
    return this.prisma.usuarioCuenta.update({ where: { id }, data: dto });
  }

  async removeUsuarioCuenta(id: number) {
    await this.findUsuarioCuentaById(id);
    return this.prisma.usuarioCuenta.delete({ where: { id } });
  }
}
