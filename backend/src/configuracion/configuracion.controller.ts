import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConfiguracionService } from './configuracion.service';
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

@ApiTags('Configuración')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('configuracion')
export class ConfiguracionController {
  constructor(private readonly configuracionService: ConfiguracionService) {}

  // ============================================================
  // PARAMETROS SISTEMA
  // ============================================================

  @Get('parametros-sistema')
  @ApiOperation({ summary: 'Listar parámetros de sistema (solo visibles)' })
  @ApiQuery({ name: 'modulo', required: false, type: String })
  @ApiQuery({ name: 'tipo', required: false, type: String })
  findAllParametrosSistema(
    @Query('modulo') modulo?: string,
    @Query('tipo') tipo?: string,
  ) {
    return this.configuracionService.findAllParametrosSistema({ modulo, tipo });
  }

  @Get('parametros-sistema/modulos')
  @ApiOperation({ summary: 'Listar módulos disponibles (categorías de parámetros)' })
  getModulosDisponibles() {
    return this.configuracionService.getModulosDisponibles();
  }

  @Get('parametros-sistema/codigo/:codigo')
  @ApiOperation({ summary: 'Obtener parámetro por código técnico' })
  findParametroByCodigo(@Param('codigo') codigo: string) {
    return this.configuracionService.findParametroByCodigo(codigo);
  }

  @Get('parametros-sistema/:id')
  @ApiOperation({ summary: 'Obtener parámetro de sistema por ID' })
  findOneParametroSistema(@Param('id', ParseIntPipe) id: number) {
    return this.configuracionService.findOneParametroSistema(id);
  }

  @Post('parametros-sistema')
  @ApiOperation({ summary: 'Crear parámetro de sistema' })
  createParametroSistema(@Body() dto: CreateParametroSistemaDto) {
    return this.configuracionService.createParametroSistema(dto);
  }

  @Put('parametros-sistema/:id')
  @ApiOperation({ summary: 'Actualizar parámetro de sistema' })
  updateParametroSistema(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateParametroSistemaDto,
  ) {
    return this.configuracionService.updateParametroSistema(id, dto);
  }

  @Patch('parametros-sistema/:id/valor')
  @ApiOperation({ summary: 'Actualización rápida de valor (con validación de tipo)' })
  updateValorParametro(
    @Param('id', ParseIntPipe) id: number,
    @Body('valor') valor: string,
  ) {
    return this.configuracionService.updateValorParametro(id, valor);
  }

  @Delete('parametros-sistema/:id')
  @ApiOperation({ summary: 'Ocultar parámetro de sistema (soft-delete)' })
  removeParametroSistema(@Param('id', ParseIntPipe) id: number) {
    return this.configuracionService.removeParametroSistema(id);
  }

  // ============================================================
  // INDICADORES ECONOMICOS
  // ============================================================

  @Get('indicadores-economicos')
  @ApiOperation({ summary: 'Listar indicadores económicos' })
  @ApiQuery({ name: 'codigo', required: false, type: String })
  findAllIndicadoresEconomicos(@Query('codigo') codigo?: string) {
    return this.configuracionService.findAllIndicadoresEconomicos({ codigo });
  }

  @Get('indicadores-economicos/actual/:codigo')
  @ApiOperation({ summary: 'Obtener el indicador económico más reciente por código' })
  findActualIndicadorEconomico(@Param('codigo') codigo: string) {
    return this.configuracionService.findActualByCodigo(codigo);
  }

  @Get('indicadores-economicos/:id')
  @ApiOperation({ summary: 'Obtener indicador económico por ID' })
  findOneIndicadorEconomico(@Param('id', ParseIntPipe) id: number) {
    return this.configuracionService.findOneIndicadorEconomico(id);
  }

  @Post('indicadores-economicos')
  @ApiOperation({ summary: 'Crear indicador económico' })
  createIndicadorEconomico(@Body() dto: CreateIndicadorEconomicoDto) {
    return this.configuracionService.createIndicadorEconomico(dto);
  }

  @Put('indicadores-economicos/:id')
  @ApiOperation({ summary: 'Actualizar indicador económico' })
  updateIndicadorEconomico(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateIndicadorEconomicoDto,
  ) {
    return this.configuracionService.updateIndicadorEconomico(id, dto);
  }

  @Delete('indicadores-economicos/:id')
  @ApiOperation({ summary: 'Eliminar indicador económico' })
  removeIndicadorEconomico(@Param('id', ParseIntPipe) id: number) {
    return this.configuracionService.removeIndicadorEconomico(id);
  }

  // ============================================================
  // CODIGOS AERONAUTICOS
  // ============================================================

  @Get('codigos-aeronauticos')
  @ApiOperation({ summary: 'Listar códigos aeronáuticos' })
  @ApiQuery({ name: 'tipo', required: false, type: Number })
  findAllCodigosAeronauticos(@Query('tipo') tipo?: string) {
    return this.configuracionService.findAllCodigosAeronauticos({
      tipo: tipo ? parseInt(tipo, 10) : undefined,
    });
  }

  @Get('codigos-aeronauticos/:id')
  @ApiOperation({ summary: 'Obtener código aeronáutico por ID' })
  findOneCodigoAeronautico(@Param('id', ParseIntPipe) id: number) {
    return this.configuracionService.findOneCodigoAeronautico(id);
  }

  @Post('codigos-aeronauticos')
  @ApiOperation({ summary: 'Crear código aeronáutico' })
  createCodigoAeronautico(@Body() dto: CreateCodigoAeronauticoDto) {
    return this.configuracionService.createCodigoAeronautico(dto);
  }

  @Put('codigos-aeronauticos/:id')
  @ApiOperation({ summary: 'Actualizar código aeronáutico' })
  updateCodigoAeronautico(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCodigoAeronauticoDto,
  ) {
    return this.configuracionService.updateCodigoAeronautico(id, dto);
  }

  @Delete('codigos-aeronauticos/:id')
  @ApiOperation({ summary: 'Eliminar código aeronáutico' })
  removeCodigoAeronautico(@Param('id', ParseIntPipe) id: number) {
    return this.configuracionService.removeCodigoAeronautico(id);
  }

  // ============================================================
  // SERVICIOS AEREOS
  // ============================================================

  @Get('servicios-aereos')
  @ApiOperation({ summary: 'Listar servicios aéreos' })
  findAllServiciosAereos() {
    return this.configuracionService.findAllServiciosAereos();
  }

  @Get('servicios-aereos/:id')
  @ApiOperation({ summary: 'Obtener servicio aéreo por ID' })
  findOneServicioAereo(@Param('id', ParseIntPipe) id: number) {
    return this.configuracionService.findOneServicioAereo(id);
  }

  @Post('servicios-aereos')
  @ApiOperation({ summary: 'Crear servicio aéreo' })
  createServicioAereo(@Body() dto: CreateServicioAereoDto) {
    return this.configuracionService.createServicioAereo(dto);
  }

  @Put('servicios-aereos/:id')
  @ApiOperation({ summary: 'Actualizar servicio aéreo' })
  updateServicioAereo(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateServicioAereoDto,
  ) {
    return this.configuracionService.updateServicioAereo(id, dto);
  }

  @Delete('servicios-aereos/:id')
  @ApiOperation({ summary: 'Eliminar servicio aéreo' })
  removeServicioAereo(@Param('id', ParseIntPipe) id: number) {
    return this.configuracionService.removeServicioAereo(id);
  }

  // ============================================================
  // SECUENCIAS
  // ============================================================

  @Get('secuencias')
  @ApiOperation({ summary: 'Listar secuencias' })
  findAllSecuencias() {
    return this.configuracionService.findAllSecuencias();
  }

  @Get('secuencias/:id')
  @ApiOperation({ summary: 'Obtener secuencia por ID' })
  findOneSecuencia(@Param('id', ParseIntPipe) id: number) {
    return this.configuracionService.findOneSecuencia(id);
  }

  @Post('secuencias')
  @ApiOperation({ summary: 'Crear secuencia' })
  createSecuencia(@Body() dto: CreateSecuenciaDto) {
    return this.configuracionService.createSecuencia(dto);
  }

  @Post('secuencias/:id/incrementar')
  @ApiOperation({ summary: 'Incrementar consecutivo de secuencia' })
  incrementarSecuencia(@Param('id', ParseIntPipe) id: number) {
    return this.configuracionService.incrementarSecuencia(id);
  }

  @Post('secuencias/obtener-siguiente/:nombre')
  @ApiOperation({ summary: 'Obtener siguiente valor por nombre de secuencia' })
  obtenerSiguiente(@Param('nombre') nombre: string) {
    return this.configuracionService.obtenerSiguiente(nombre);
  }

  @Put('secuencias/:id')
  @ApiOperation({ summary: 'Actualizar secuencia' })
  updateSecuencia(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSecuenciaDto,
  ) {
    return this.configuracionService.updateSecuencia(id, dto);
  }

  @Delete('secuencias/:id')
  @ApiOperation({ summary: 'Eliminar secuencia' })
  removeSecuencia(@Param('id', ParseIntPipe) id: number) {
    return this.configuracionService.removeSecuencia(id);
  }

  // ============================================================
  // MENSAJES
  // ============================================================

  @Get('mensajes')
  @ApiOperation({ summary: 'Listar mensajes' })
  @ApiQuery({ name: 'idUsuario', required: false, type: Number })
  @ApiQuery({ name: 'leido', required: false, type: Boolean })
  @ApiQuery({ name: 'tipo', required: false, type: String })
  findAllMensajes(
    @Query('idUsuario') idUsuario?: string,
    @Query('leido') leido?: string,
    @Query('tipo') tipo?: string,
  ) {
    return this.configuracionService.findAllMensajes({
      idUsuario: idUsuario ? parseInt(idUsuario, 10) : undefined,
      leido: leido !== undefined ? leido === 'true' : undefined,
      tipo,
    });
  }

  @Get('mensajes/:id')
  @ApiOperation({ summary: 'Obtener mensaje por ID' })
  findOneMensaje(@Param('id', ParseIntPipe) id: number) {
    return this.configuracionService.findOneMensaje(id);
  }

  @Post('mensajes')
  @ApiOperation({ summary: 'Crear mensaje' })
  createMensaje(@Body() dto: CreateMensajeDto) {
    return this.configuracionService.createMensaje(dto);
  }

  @Patch('mensajes/:id/marcar-leido')
  @ApiOperation({ summary: 'Marcar mensaje como leído' })
  marcarLeido(@Param('id', ParseIntPipe) id: number) {
    return this.configuracionService.marcarComoLeido(id);
  }

  @Put('mensajes/:id')
  @ApiOperation({ summary: 'Actualizar mensaje' })
  updateMensaje(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMensajeDto,
  ) {
    return this.configuracionService.updateMensaje(id, dto);
  }

  @Delete('mensajes/:id')
  @ApiOperation({ summary: 'Eliminar mensaje' })
  removeMensaje(@Param('id', ParseIntPipe) id: number) {
    return this.configuracionService.removeMensaje(id);
  }

  // ============================================================
  // TIPOS EVENTO
  // ============================================================

  @Get('tipos-evento')
  @ApiOperation({ summary: 'Listar tipos de evento' })
  findAllTiposEvento() {
    return this.configuracionService.findAllTiposEvento();
  }

  @Get('tipos-evento/:codigo')
  @ApiOperation({ summary: 'Obtener tipo de evento por código' })
  findOneTipoEvento(@Param('codigo') codigo: string) {
    return this.configuracionService.findOneTipoEvento(codigo);
  }

  @Post('tipos-evento')
  @ApiOperation({ summary: 'Crear tipo de evento' })
  createTipoEvento(@Body() dto: CreateTipoEventoDto) {
    return this.configuracionService.createTipoEvento(dto);
  }

  @Put('tipos-evento/:codigo')
  @ApiOperation({ summary: 'Actualizar tipo de evento' })
  updateTipoEvento(
    @Param('codigo') codigo: string,
    @Body() dto: UpdateTipoEventoDto,
  ) {
    return this.configuracionService.updateTipoEvento(codigo, dto);
  }

  @Delete('tipos-evento/:codigo')
  @ApiOperation({ summary: 'Eliminar tipo de evento' })
  removeTipoEvento(@Param('codigo') codigo: string) {
    return this.configuracionService.removeTipoEvento(codigo);
  }

  // ============================================================
  // EVENTOS
  // ============================================================

  @Get('eventos')
  @ApiOperation({ summary: 'Listar eventos' })
  @ApiQuery({ name: 'codigoTipo', required: false, type: String })
  @ApiQuery({ name: 'deshabilitar', required: false, type: Boolean })
  findAllEventos(
    @Query('codigoTipo') codigoTipo?: string,
    @Query('deshabilitar') deshabilitar?: string,
  ) {
    return this.configuracionService.findAllEventos({
      codigoTipo,
      deshabilitar: deshabilitar !== undefined ? deshabilitar === 'true' : undefined,
    });
  }

  @Get('eventos/:id')
  @ApiOperation({ summary: 'Obtener evento por ID' })
  findOneEvento(@Param('id', ParseIntPipe) id: number) {
    return this.configuracionService.findOneEvento(id);
  }

  @Post('eventos')
  @ApiOperation({ summary: 'Crear evento' })
  createEvento(@Body() dto: CreateEventoDto) {
    return this.configuracionService.createEvento(dto);
  }

  @Put('eventos/:id')
  @ApiOperation({ summary: 'Actualizar evento' })
  updateEvento(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEventoDto,
  ) {
    return this.configuracionService.updateEvento(id, dto);
  }

  @Delete('eventos/:id')
  @ApiOperation({ summary: 'Eliminar evento' })
  removeEvento(@Param('id', ParseIntPipe) id: number) {
    return this.configuracionService.removeEvento(id);
  }

  // ============================================================
  // APLICACIONES
  // ============================================================

  @Get('aplicaciones')
  @ApiOperation({ summary: 'Listar aplicaciones' })
  findAllAplicaciones() {
    return this.configuracionService.findAllAplicaciones();
  }

  @Get('aplicaciones/:id')
  @ApiOperation({ summary: 'Obtener aplicación por ID' })
  findOneAplicacion(@Param('id', ParseIntPipe) id: number) {
    return this.configuracionService.findOneAplicacion(id);
  }

  @Post('aplicaciones')
  @ApiOperation({ summary: 'Crear aplicación' })
  createAplicacion(@Body() dto: CreateAplicacionDto) {
    return this.configuracionService.createAplicacion(dto);
  }

  @Put('aplicaciones/:id')
  @ApiOperation({ summary: 'Actualizar aplicación' })
  updateAplicacion(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAplicacionDto,
  ) {
    return this.configuracionService.updateAplicacion(id, dto);
  }

  @Delete('aplicaciones/:id')
  @ApiOperation({ summary: 'Eliminar aplicación' })
  removeAplicacion(@Param('id', ParseIntPipe) id: number) {
    return this.configuracionService.removeAplicacion(id);
  }
}
