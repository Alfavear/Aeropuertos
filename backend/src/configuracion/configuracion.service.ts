import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SecuenciaService } from '../secuencia/secuencia.service';
import { CreateParametroSistemaDto } from './dto/create-parametro-sistema.dto';
import { UpdateParametroSistemaDto } from './dto/update-parametro-sistema.dto';
import { CreateIndicadorEconomicoDto } from './dto/create-indicador-economico.dto';
import { UpdateIndicadorEconomicoDto } from './dto/update-indicador-economico.dto';
import { CreateCodigoAeronauticoDto } from './dto/create-codigo-aeronautico.dto';
import { UpdateCodigoAeronauticoDto } from './dto/update-codigo-aeronautico.dto';
import { CreateServicioAereoDto } from './dto/create-servicio-aereo.dto';
import { UpdateServicioAereoDto } from './dto/update-servicio-aereo.dto';
import { CreateSecuenciaDto } from './dto/create-secuencia.dto';
import { UpdateSecuenciaDto } from './dto/update-secuencia.dto';
import { CreateMensajeDto } from './dto/create-mensaje.dto';
import { UpdateMensajeDto } from './dto/update-mensaje.dto';
import { CreateTipoEventoDto } from './dto/create-tipo-evento.dto';
import { UpdateTipoEventoDto } from './dto/update-tipo-evento.dto';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { CreateAplicacionDto } from './dto/create-aplicacion.dto';
import { UpdateAplicacionDto } from './dto/update-aplicacion.dto';

@Injectable()
export class ConfiguracionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly secuenciaService: SecuenciaService,
  ) {}

  // ============================================================
  // PARAMETROS SISTEMA
  // ============================================================

  async findAllParametrosSistema(filtros?: { modulo?: string; tipo?: string }) {
    const where: Record<string, unknown> = { visible: true };
    if (filtros?.modulo !== undefined) where.modulo = filtros.modulo;
    if (filtros?.tipo !== undefined) where.tipo = filtros.tipo;
    return this.prisma.parametroSistema.findMany({
      where,
      orderBy: [{ modulo: 'asc' }, { orden: 'asc' }],
    });
  }

  async getModulosDisponibles(): Promise<string[]> {
    const result = await this.prisma.parametroSistema.findMany({
      where: { visible: true },
      select: { modulo: true },
      distinct: ['modulo'],
      orderBy: { modulo: 'asc' },
    });
    return result.map((r: { modulo: string | null }) => r.modulo).filter((m): m is string => m !== null);
  }

  async findOneParametroSistema(id: number) {
    const registro = await this.prisma.parametroSistema.findUnique({ where: { id } });
    if (!registro) throw new NotFoundException('Parámetro de sistema no encontrado');
    return registro;
  }

  async findParametroByCodigo(codigo: string) {
    const registro = await this.prisma.parametroSistema.findUnique({ where: { codigo } });
    if (!registro) throw new NotFoundException(`Parámetro '${codigo}' no encontrado`);
    return registro;
  }

  async createParametroSistema(dto: CreateParametroSistemaDto) {
    const existente = await this.prisma.parametroSistema.findUnique({
      where: { codigo: dto.codigo },
    });
    if (existente) {
      throw new BadRequestException(`Ya existe un parámetro con el código ${dto.codigo}`);
    }

    // Auto-calcular orden si no se proporciona
    const maxOrden = await this.prisma.parametroSistema.aggregate({
      where: { modulo: dto.modulo },
      _max: { orden: true },
    });

    return this.prisma.parametroSistema.create({
      data: {
        ...dto,
        orden: dto.orden ?? (maxOrden._max.orden ?? 0) + 10,
        editable: dto.editable ?? true,
        visible: dto.visible ?? true,
      },
    });
  }

  async updateParametroSistema(id: number, dto: UpdateParametroSistemaDto) {
    await this.findOneParametroSistema(id);
    if (dto.codigo !== undefined) {
      const existente = await this.prisma.parametroSistema.findUnique({
        where: { codigo: dto.codigo },
      });
      if (existente && existente.id !== id) {
        throw new BadRequestException(`Ya existe un parámetro con el código ${dto.codigo}`);
      }
    }
    return this.prisma.parametroSistema.update({ where: { id }, data: dto });
  }

  async updateValorParametro(id: number, valor: string) {
    const parametro = await this.findOneParametroSistema(id);

    // Validar según el tipo del parámetro
    if (parametro.tipo === 'NUMBER' && isNaN(Number(valor))) {
      throw new BadRequestException(`El parámetro '${parametro.codigo}' espera un valor numérico`);
    }
    if (parametro.tipo === 'BOOLEAN' && !['true', 'false'].includes(valor.toLowerCase())) {
      throw new BadRequestException(`El parámetro '${parametro.codigo}' espera 'true' o 'false'`);
    }
    if (parametro.tipo === 'OPTIONS' && parametro.opciones) {
      const opcionesValidas = parametro.opciones.split(',').map((o: string) => o.trim());
      if (!opcionesValidas.includes(valor)) {
        throw new BadRequestException(
          `Valor '${valor}' no válido. Opciones: ${parametro.opciones}`,
        );
      }
    }

    return this.prisma.parametroSistema.update({
      where: { id },
      data: { valor },
    });
  }

  async removeParametroSistema(id: number) {
    await this.findOneParametroSistema(id);
    // Soft-delete: solo ocultamos, nunca borramos parámetros
    return this.prisma.parametroSistema.update({
      where: { id },
      data: { visible: false },
    });
  }

  // ============================================================
  // INDICADORES ECONOMICOS
  // ============================================================

  async findAllIndicadoresEconomicos(filtros?: { codigo?: string }) {
    const where: Record<string, unknown> = {};
    if (filtros?.codigo !== undefined) where.codigo = filtros.codigo;
    return this.prisma.indicadorEconomico.findMany({ where, orderBy: { id: 'asc' } });
  }

  async findOneIndicadorEconomico(id: number) {
    const registro = await this.prisma.indicadorEconomico.findUnique({ where: { id } });
    if (!registro) throw new NotFoundException('Indicador económico no encontrado');
    return registro;
  }

  async findActualByCodigo(codigo: string) {
    const registro = await this.prisma.indicadorEconomico.findFirst({
      where: { codigo },
      orderBy: { fecha: 'desc' },
    });
    if (!registro) {
      throw new NotFoundException(`No se encontró el indicador económico ${codigo}`);
    }
    return registro;
  }

  async createIndicadorEconomico(dto: CreateIndicadorEconomicoDto) {
    const existente = await this.prisma.indicadorEconomico.findFirst({
      where: { codigo: dto.codigo },
    });
    if (existente) {
      throw new BadRequestException(`Ya existe un indicador con el código ${dto.codigo}`);
    }
    return this.prisma.indicadorEconomico.create({ data: { ...dto, valorProx: dto.valorProx ?? dto.valor } });
  }

  async updateIndicadorEconomico(id: number, dto: UpdateIndicadorEconomicoDto) {
    await this.findOneIndicadorEconomico(id);
    if (dto.codigo !== undefined) {
      const existente = await this.prisma.indicadorEconomico.findFirst({
        where: { codigo: dto.codigo },
      });
      if (existente && existente.id !== id) {
        throw new BadRequestException(`Ya existe un indicador con el código ${dto.codigo}`);
      }
    }
    return this.prisma.indicadorEconomico.update({ where: { id }, data: dto });
  }

  async removeIndicadorEconomico(id: number) {
    await this.findOneIndicadorEconomico(id);
    return this.prisma.indicadorEconomico.delete({ where: { id } });
  }

  // ============================================================
  // CODIGOS AERONAUTICOS
  // ============================================================

  async findAllCodigosAeronauticos(filtros?: { tipo?: number }) {
    const where: Record<string, unknown> = {};
    if (filtros?.tipo !== undefined) where.tipo = filtros.tipo;
    return this.prisma.codigoAeronautico.findMany({ where, orderBy: { id: 'asc' } });
  }

  async findOneCodigoAeronautico(id: number) {
    const registro = await this.prisma.codigoAeronautico.findUnique({ where: { id } });
    if (!registro) throw new NotFoundException('Código aeronáutico no encontrado');
    return registro;
  }

  async createCodigoAeronautico(dto: CreateCodigoAeronauticoDto) {
    const existente = await this.prisma.codigoAeronautico.findFirst({
      where: { codigo: dto.codigo, tipo: dto.tipo },
    });
    if (existente) {
      throw new BadRequestException(
        `Ya existe un código aeronáutico con el código ${dto.codigo} y tipo ${dto.tipo}`,
      );
    }
    return this.prisma.codigoAeronautico.create({ data: dto });
  }

  async updateCodigoAeronautico(id: number, dto: UpdateCodigoAeronauticoDto) {
    await this.findOneCodigoAeronautico(id);
    if (dto.codigo !== undefined || dto.tipo !== undefined) {
      const existente = await this.prisma.codigoAeronautico.findFirst({
        where: {
          codigo: dto.codigo ?? (await this.findOneCodigoAeronautico(id)).codigo,
          tipo: dto.tipo ?? (await this.findOneCodigoAeronautico(id)).tipo,
        },
      });
      if (existente && Number(existente.id) !== id) {
        throw new BadRequestException(
          'Ya existe un código aeronáutico con ese código y tipo',
        );
      }
    }
    return this.prisma.codigoAeronautico.update({ where: { id }, data: dto });
  }

  async removeCodigoAeronautico(id: number) {
    await this.findOneCodigoAeronautico(id);
    return this.prisma.codigoAeronautico.delete({ where: { id } });
  }

  // ============================================================
  // SERVICIOS AEREOS
  // ============================================================

  async findAllServiciosAereos() {
    return this.prisma.servicioAereo.findMany({ orderBy: { id: 'asc' } });
  }

  async findOneServicioAereo(id: number) {
    const registro = await this.prisma.servicioAereo.findUnique({ where: { id } });
    if (!registro) throw new NotFoundException('Servicio aéreo no encontrado');
    return registro;
  }

  async createServicioAereo(dto: CreateServicioAereoDto) {
    const existente = await this.prisma.servicioAereo.findFirst({
      where: { codigo: dto.codigo },
    });
    if (existente) {
      throw new BadRequestException(`Ya existe un servicio con el código ${dto.codigo}`);
    }
    return this.prisma.servicioAereo.create({ data: dto });
  }

  async updateServicioAereo(id: number, dto: UpdateServicioAereoDto) {
    await this.findOneServicioAereo(id);
    if (dto.codigo !== undefined) {
      const existente = await this.prisma.servicioAereo.findFirst({
        where: { codigo: dto.codigo },
      });
      if (existente && existente.id !== id) {
        throw new BadRequestException(`Ya existe un servicio con el código ${dto.codigo}`);
      }
    }
    return this.prisma.servicioAereo.update({ where: { id }, data: dto });
  }

  async removeServicioAereo(id: number) {
    await this.findOneServicioAereo(id);
    return this.prisma.servicioAereo.delete({ where: { id } });
  }

  // ============================================================
  // SECUENCIAS
  // ============================================================

  async findAllSecuencias() {
    return this.prisma.secuencia.findMany({ orderBy: { id: 'asc' } });
  }

  async findOneSecuencia(id: number) {
    const registro = await this.prisma.secuencia.findUnique({ where: { id } });
    if (!registro) throw new NotFoundException('Secuencia no encontrada');
    return registro;
  }

  async createSecuencia(dto: CreateSecuenciaDto) {
    const existente = await this.prisma.secuencia.findFirst({
      where: { nombre: dto.nombre },
    });
    if (existente) {
      throw new BadRequestException(`Ya existe una secuencia con el nombre ${dto.nombre}`);
    }
    return this.prisma.secuencia.create({ data: dto });
  }

  async updateSecuencia(id: number, dto: UpdateSecuenciaDto) {
    await this.findOneSecuencia(id);
    if (dto.nombre !== undefined) {
      const existente = await this.prisma.secuencia.findFirst({
        where: { nombre: dto.nombre },
      });
      if (existente && existente.id !== id) {
        throw new BadRequestException(`Ya existe una secuencia con el nombre ${dto.nombre}`);
      }
    }
    return this.prisma.secuencia.update({ where: { id }, data: dto });
  }

  async incrementarSecuencia(id: number) {
    const secuencia = await this.findOneSecuencia(id);
    if (secuencia.idAeropuerto == null) {
      throw new BadRequestException('La secuencia no está asociada a un aeropuerto');
    }
    return this.secuenciaService.establecerValor(
      secuencia.nombre,
      secuencia.idAeropuerto,
      secuencia.consecutivo + 1,
    );
  }

  async obtenerSiguiente(nombre: string, idAeropuerto?: number) {
    if (idAeropuerto) {
      return this.secuenciaService.obtenerSiguiente(nombre, idAeropuerto);
    }

    const secuencia = await this.prisma.secuencia.findFirst({ where: { nombre } });
    if (!secuencia) {
      throw new NotFoundException(`Secuencia ${nombre} no encontrada`);
    }
    if (secuencia.idAeropuerto == null) {
      throw new BadRequestException('La secuencia no está asociada a un aeropuerto');
    }
    return this.secuenciaService.obtenerSiguiente(nombre, secuencia.idAeropuerto);
  }

  async removeSecuencia(id: number) {
    await this.findOneSecuencia(id);
    return this.prisma.secuencia.delete({ where: { id } });
  }

  // ============================================================
  // MENSAJES
  // ============================================================

  async findAllMensajes(filtros?: { idUsuario?: number; leido?: boolean; tipo?: string }) {
    const where: Record<string, unknown> = {};
    if (filtros?.idUsuario !== undefined) where.idUsuario = filtros.idUsuario;
    if (filtros?.leido !== undefined) where.leido = filtros.leido;
    if (filtros?.tipo !== undefined) where.tipo = filtros.tipo;
    return this.prisma.mensaje.findMany({ where, orderBy: { id: 'asc' } });
  }

  async findOneMensaje(id: number) {
    const registro = await this.prisma.mensaje.findUnique({ where: { id } });
    if (!registro) throw new NotFoundException('Mensaje no encontrado');
    return registro;
  }

  async createMensaje(dto: CreateMensajeDto) {
    const existente = await this.prisma.mensaje.findFirst({
      where: { codigo: dto.codigo },
    });
    if (existente) {
      throw new BadRequestException(`Ya existe un mensaje con el código ${dto.codigo}`);
    }
    return this.prisma.mensaje.create({ data: dto });
  }

  async updateMensaje(id: number, dto: UpdateMensajeDto) {
    await this.findOneMensaje(id);
    if (dto.codigo !== undefined) {
      const existente = await this.prisma.mensaje.findFirst({
        where: { codigo: dto.codigo },
      });
      if (existente && existente.id !== id) {
        throw new BadRequestException(`Ya existe un mensaje con el código ${dto.codigo}`);
      }
    }
    return this.prisma.mensaje.update({ where: { id }, data: dto });
  }

  async marcarComoLeido(id: number) {
    await this.findOneMensaje(id);
    return this.prisma.mensaje.update({
      where: { id },
      data: { leido: true },
    });
  }

  async removeMensaje(id: number) {
    await this.findOneMensaje(id);
    return this.prisma.mensaje.delete({ where: { id } });
  }

  // ============================================================
  // TIPOS EVENTO
  // ============================================================

  async findAllTiposEvento() {
    return this.prisma.tipoEvento.findMany({ orderBy: { codigo: 'asc' } });
  }

  async findOneTipoEvento(codigo: string) {
    const registro = await this.prisma.tipoEvento.findUnique({ where: { codigo } });
    if (!registro) throw new NotFoundException('Tipo de evento no encontrado');
    return registro;
  }

  async createTipoEvento(dto: CreateTipoEventoDto) {
    const existente = await this.prisma.tipoEvento.findUnique({
      where: { codigo: dto.codigo },
    });
    if (existente) {
      throw new BadRequestException(`Ya existe un tipo de evento con el código ${dto.codigo}`);
    }
    return this.prisma.tipoEvento.create({ data: dto });
  }

  async updateTipoEvento(codigo: string, dto: UpdateTipoEventoDto) {
    await this.findOneTipoEvento(codigo);
    return this.prisma.tipoEvento.update({ where: { codigo }, data: dto });
  }

  async removeTipoEvento(codigo: string) {
    await this.findOneTipoEvento(codigo);
    const eventos = await this.prisma.evento.count({ where: { codigoTipo: codigo } });
    if (eventos > 0) {
      throw new BadRequestException(
        'No se puede eliminar el tipo de evento porque tiene eventos asociados',
      );
    }
    return this.prisma.tipoEvento.delete({ where: { codigo } });
  }

  // ============================================================
  // EVENTOS
  // ============================================================

  async findAllEventos(filtros?: { codigoTipo?: string; deshabilitar?: boolean }) {
    const where: Record<string, unknown> = {};
    if (filtros?.codigoTipo !== undefined) where.codigoTipo = filtros.codigoTipo;
    if (filtros?.deshabilitar !== undefined) where.deshabilitar = filtros.deshabilitar;
    return this.prisma.evento.findMany({ where, orderBy: { id: 'asc' } });
  }

  async findOneEvento(id: number) {
    const registro = await this.prisma.evento.findUnique({ where: { id } });
    if (!registro) throw new NotFoundException('Evento no encontrado');
    return registro;
  }

  async createEvento(dto: CreateEventoDto) {
    const tipoEvento = await this.prisma.tipoEvento.findUnique({
      where: { codigo: dto.codigoTipo },
    });
    if (!tipoEvento) {
      throw new BadRequestException('El tipo de evento especificado no existe');
    }
    const existente = await this.prisma.evento.findFirst({
      where: { codigoTipo: dto.codigoTipo, codigo: dto.codigo },
    });
    if (existente) {
      throw new BadRequestException(
        `Ya existe un evento con el código ${dto.codigo} en este tipo`,
      );
    }
    return this.prisma.evento.create({ data: dto });
  }

  async updateEvento(id: number, dto: UpdateEventoDto) {
    await this.findOneEvento(id);
    if (dto.codigoTipo !== undefined) {
      const tipoEvento = await this.prisma.tipoEvento.findUnique({
        where: { codigo: dto.codigoTipo },
      });
      if (!tipoEvento) {
        throw new BadRequestException('El tipo de evento especificado no existe');
      }
    }
    if (dto.codigo !== undefined || dto.codigoTipo !== undefined) {
      const actual = await this.findOneEvento(id);
      const codigoTipo = dto.codigoTipo ?? actual.codigoTipo;
      const codigo = dto.codigo ?? actual.codigo;
      const existente = await this.prisma.evento.findFirst({
        where: { codigoTipo, codigo },
      });
      if (existente && existente.id !== id) {
        throw new BadRequestException(
          `Ya existe un evento con el código ${codigo} en este tipo`,
        );
      }
    }
    return this.prisma.evento.update({ where: { id }, data: dto });
  }

  async removeEvento(id: number) {
    await this.findOneEvento(id);
    return this.prisma.evento.delete({ where: { id } });
  }

  // ============================================================
  // APLICACIONES
  // ============================================================

  async findAllAplicaciones() {
    return this.prisma.aplicacion.findMany({ orderBy: { id: 'asc' } });
  }

  async findOneAplicacion(id: number) {
    const registro = await this.prisma.aplicacion.findUnique({ where: { id } });
    if (!registro) throw new NotFoundException('Aplicación no encontrada');
    return registro;
  }

  async createAplicacion(dto: CreateAplicacionDto) {
    const existente = await this.prisma.aplicacion.findFirst({
      where: { nombre: dto.nombre },
    });
    if (existente) {
      throw new BadRequestException(`Ya existe una aplicación con el nombre ${dto.nombre}`);
    }
    return this.prisma.aplicacion.create({ data: dto });
  }

  async updateAplicacion(id: number, dto: UpdateAplicacionDto) {
    await this.findOneAplicacion(id);
    if (dto.nombre !== undefined) {
      const existente = await this.prisma.aplicacion.findFirst({
        where: { nombre: dto.nombre },
      });
      if (existente && existente.id !== id) {
        throw new BadRequestException(`Ya existe una aplicación con el nombre ${dto.nombre}`);
      }
    }
    return this.prisma.aplicacion.update({ where: { id }, data: dto });
  }

  async removeAplicacion(id: number) {
    await this.findOneAplicacion(id);
    return this.prisma.aplicacion.delete({ where: { id } });
  }
}
