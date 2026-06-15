import { Controller, Get, Post, Put, Delete, Param, Body, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AeropuertoActivoGuard } from '../auth/aeropuerto-activo.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { OperacionesService } from './operaciones.service';
import { CalculosService } from './calculos.service';
import { CreateItinerarioDto } from './dto/create-itinerario.dto';
import { UpdateItinerarioDto } from './dto/update-itinerario.dto';
import { CreateVueloDto } from './dto/create-vuelo.dto';
import { UpdateVueloDto } from './dto/update-vuelo.dto';
import { CreatePuertaEmbarqueDto } from './dto/create-puerta-embarque.dto';
import { UpdatePuertaEmbarqueDto } from './dto/update-puerta-embarque.dto';
import { CreateHangarDto } from './dto/create-hangar.dto';
import { UpdateHangarDto } from './dto/update-hangar.dto';
import { CreateServicioOperacionDto } from './dto/create-servicio-operacion.dto';
import { UpdateServicioOperacionDto } from './dto/update-servicio-operacion.dto';
import { CreateRegistroPesoDto } from './dto/create-registro-peso.dto';
import { UpdateRegistroPesoDto } from './dto/update-registro-peso.dto';
import { CreateAsignacionPuertaVueloDto } from './dto/create-asignacion-puerta-vuelo.dto';
import { UpdateAsignacionPuertaVueloDto } from './dto/update-asignacion-puerta-vuelo.dto';
import { CreateNotaOperacionDto } from './dto/create-nota-operacion.dto';
import { UpdateNotaOperacionDto } from './dto/update-nota-operacion.dto';
import { CalcularConceptosDto } from './dto/calcular-conceptos.dto';

@ApiTags('Operaciones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AeropuertoActivoGuard)
@Controller('operaciones')
export class OperacionesController {
  constructor(
    private readonly operacionesService: OperacionesService,
    private readonly calculosService: CalculosService,
  ) {}

  // ── ITINERARIOS ──
  @Get('itinerarios')
  @ApiOperation({ summary: 'Listar itinerarios' })
  findAllItinerarios(
    @Query('codAeropuerto') codAeropuerto?: string,
    @Query('codAerolinea') codAerolinea?: string,
    @Query('ejecutado') ejecutado?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.operacionesService.findAllItinerarios({ codAeropuerto, codAerolinea, ejecutado, skip, take });
  }

  @Get('itinerarios/:id')
  @ApiOperation({ summary: 'Obtener itinerario por ID' })
  findOneItinerario(@Param('id', ParseIntPipe) id: number) {
    return this.operacionesService.findOneItinerario(id);
  }

  @Post('itinerarios')
  @ApiOperation({ summary: 'Crear itinerario' })
  createItinerario(@Body() dto: CreateItinerarioDto) {
    return this.operacionesService.createItinerario(dto);
  }

  @Put('itinerarios/:id')
  @ApiOperation({ summary: 'Actualizar itinerario' })
  updateItinerario(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateItinerarioDto) {
    return this.operacionesService.updateItinerario(id, dto);
  }

  @Delete('itinerarios/:id')
  @ApiOperation({ summary: 'Eliminar itinerario' })
  removeItinerario(@Param('id', ParseIntPipe) id: number) {
    return this.operacionesService.removeItinerario(id);
  }

  // ── VUELOS ──
  @Get('vuelos')
  @ApiOperation({ summary: 'Listar vuelos' })
  findAllVuelos(
    @Query('idAerolinea') idAerolinea?: string,
    @Query('origen') origen?: string,
    @Query('destino') destino?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.operacionesService.findAllVuelos({ idAerolinea, origen, destino, skip, take });
  }

  @Get('vuelos/:id')
  @ApiOperation({ summary: 'Obtener vuelo por ID' })
  findOneVuelo(@Param('id', ParseIntPipe) id: number) {
    return this.operacionesService.findOneVuelo(id);
  }

  @Post('vuelos')
  @ApiOperation({ summary: 'Crear vuelo' })
  createVuelo(@Body() dto: CreateVueloDto) {
    return this.operacionesService.createVuelo(dto);
  }

  @Put('vuelos/:id')
  @ApiOperation({ summary: 'Actualizar vuelo' })
  updateVuelo(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVueloDto) {
    return this.operacionesService.updateVuelo(id, dto);
  }

  @Delete('vuelos/:id')
  @ApiOperation({ summary: 'Eliminar vuelo' })
  removeVuelo(@Param('id', ParseIntPipe) id: number) {
    return this.operacionesService.removeVuelo(id);
  }

  // ── PUERTAS EMBARQUE ──
  @Get('puertas-embarque')
  @ApiOperation({ summary: 'Listar puertas de embarque del aeropuerto activo' })
  findAllPuertasEmbarque(
    @CurrentUser('idAeropuertoActivo') idAeropuerto: number,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.operacionesService.findAllPuertasEmbarque(idAeropuerto, { skip, take });
  }

  @Get('puertas-embarque/:id')
  @ApiOperation({ summary: 'Obtener puerta de embarque por ID' })
  findOnePuertaEmbarque(@Param('id', ParseIntPipe) id: number) {
    return this.operacionesService.findOnePuertaEmbarque(id);
  }

  @Post('puertas-embarque')
  @ApiOperation({ summary: 'Crear puerta de embarque' })
  createPuertaEmbarque(
    @CurrentUser('idAeropuertoActivo') _idAeropuerto: number,
    @Body() dto: CreatePuertaEmbarqueDto,
  ) {
    dto.idAeropuerto = _idAeropuerto;
    return this.operacionesService.createPuertaEmbarque(dto);
  }

  @Put('puertas-embarque/:id')
  @ApiOperation({ summary: 'Actualizar puerta de embarque' })
  updatePuertaEmbarque(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePuertaEmbarqueDto) {
    return this.operacionesService.updatePuertaEmbarque(id, dto);
  }

  @Delete('puertas-embarque/:id')
  @ApiOperation({ summary: 'Eliminar puerta de embarque' })
  removePuertaEmbarque(@Param('id', ParseIntPipe) id: number) {
    return this.operacionesService.removePuertaEmbarque(id);
  }

  // ── HANGARES ──
  @Get('hangares')
  @ApiOperation({ summary: 'Listar hangares del aeropuerto activo' })
  findAllHangares(
    @CurrentUser('idAeropuertoActivo') idAeropuerto: number,
    @Query('tipoZona') tipoZona?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.operacionesService.findAllHangares(idAeropuerto, { tipoZona, skip, take });
  }

  @Get('hangares/:id')
  @ApiOperation({ summary: 'Obtener hangar por ID' })
  findOneHangar(@Param('id', ParseIntPipe) id: number) {
    return this.operacionesService.findOneHangar(id);
  }

  @Post('hangares')
  @ApiOperation({ summary: 'Crear hangar' })
  createHangar(
    @CurrentUser('idAeropuertoActivo') _idAeropuerto: number,
    @Body() dto: CreateHangarDto,
  ) {
    dto.idAeropuerto = _idAeropuerto;
    return this.operacionesService.createHangar(dto);
  }

  @Put('hangares/:id')
  @ApiOperation({ summary: 'Actualizar hangar' })
  updateHangar(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateHangarDto) {
    return this.operacionesService.updateHangar(id, dto);
  }

  @Delete('hangares/:id')
  @ApiOperation({ summary: 'Eliminar hangar' })
  removeHangar(@Param('id', ParseIntPipe) id: number) {
    return this.operacionesService.removeHangar(id);
  }

  // ── SERVICIOS OPERACION ──
  @Get('servicios-operacion')
  @ApiOperation({ summary: 'Listar servicios de operación' })
  findAllServiciosOperacion(
    @Query('idOperacion') idOperacion?: string,
    @Query('tipoServicio') tipoServicio?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.operacionesService.findAllServiciosOperacion({ idOperacion, tipoServicio, skip, take });
  }

  @Get('servicios-operacion/:id')
  @ApiOperation({ summary: 'Obtener servicio de operación por ID' })
  findOneServicioOperacion(@Param('id', ParseIntPipe) id: number) {
    return this.operacionesService.findOneServicioOperacion(id);
  }

  @Post('servicios-operacion')
  @ApiOperation({ summary: 'Crear servicio de operación' })
  createServicioOperacion(@Body() dto: CreateServicioOperacionDto) {
    return this.operacionesService.createServicioOperacion(dto);
  }

  @Put('servicios-operacion/:id')
  @ApiOperation({ summary: 'Actualizar servicio de operación' })
  updateServicioOperacion(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateServicioOperacionDto) {
    return this.operacionesService.updateServicioOperacion(id, dto);
  }

  @Delete('servicios-operacion/:id')
  @ApiOperation({ summary: 'Eliminar servicio de operación' })
  removeServicioOperacion(@Param('id', ParseIntPipe) id: number) {
    return this.operacionesService.removeServicioOperacion(id);
  }

  // ── REGISTROS PESO ──
  @Get('registros-peso')
  @ApiOperation({ summary: 'Listar registros de peso' })
  findAllRegistrosPeso(
    @Query('idOperacion') idOperacion?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.operacionesService.findAllRegistrosPeso({ idOperacion, skip, take });
  }

  @Get('registros-peso/:id')
  @ApiOperation({ summary: 'Obtener registro de peso por ID' })
  findOneRegistroPeso(@Param('id', ParseIntPipe) id: number) {
    return this.operacionesService.findOneRegistroPeso(id);
  }

  @Post('registros-peso')
  @ApiOperation({ summary: 'Crear registro de peso' })
  createRegistroPeso(@Body() dto: CreateRegistroPesoDto) {
    return this.operacionesService.createRegistroPeso(dto);
  }

  @Put('registros-peso/:id')
  @ApiOperation({ summary: 'Actualizar registro de peso' })
  updateRegistroPeso(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRegistroPesoDto) {
    return this.operacionesService.updateRegistroPeso(id, dto);
  }

  @Delete('registros-peso/:id')
  @ApiOperation({ summary: 'Eliminar registro de peso' })
  removeRegistroPeso(@Param('id', ParseIntPipe) id: number) {
    return this.operacionesService.removeRegistroPeso(id);
  }

  // ── ASIGNACIONES PUERTA VUELO ──
  @Get('asignaciones-puerta-vuelo')
  @ApiOperation({ summary: 'Listar asignaciones puerta-vuelo' })
  findAllAsignacionesPuertaVuelo(
    @Query('idOperacion') idOperacion?: string,
    @Query('idPuerta') idPuerta?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.operacionesService.findAllAsignacionesPuertaVuelo({ idOperacion, idPuerta, skip, take });
  }

  @Get('asignaciones-puerta-vuelo/:id')
  @ApiOperation({ summary: 'Obtener asignación puerta-vuelo por ID' })
  findOneAsignacionPuertaVuelo(@Param('id', ParseIntPipe) id: number) {
    return this.operacionesService.findOneAsignacionPuertaVuelo(id);
  }

  @Post('asignaciones-puerta-vuelo')
  @ApiOperation({ summary: 'Crear asignación puerta-vuelo' })
  createAsignacionPuertaVuelo(@Body() dto: CreateAsignacionPuertaVueloDto) {
    return this.operacionesService.createAsignacionPuertaVuelo(dto);
  }

  @Put('asignaciones-puerta-vuelo/:id')
  @ApiOperation({ summary: 'Actualizar asignación puerta-vuelo' })
  updateAsignacionPuertaVuelo(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAsignacionPuertaVueloDto) {
    return this.operacionesService.updateAsignacionPuertaVuelo(id, dto);
  }

  @Delete('asignaciones-puerta-vuelo/:id')
  @ApiOperation({ summary: 'Eliminar asignación puerta-vuelo' })
  removeAsignacionPuertaVuelo(@Param('id', ParseIntPipe) id: number) {
    return this.operacionesService.removeAsignacionPuertaVuelo(id);
  }

  // ── NOTAS OPERACION ──
  @Get('notas-operacion')
  @ApiOperation({ summary: 'Listar notas de operación' })
  findAllNotasOperacion(
    @Query('idOperacion') idOperacion?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.operacionesService.findAllNotasOperacion({ idOperacion, skip, take });
  }

  @Get('notas-operacion/:id')
  @ApiOperation({ summary: 'Obtener nota de operación por ID' })
  findOneNotaOperacion(@Param('id', ParseIntPipe) id: number) {
    return this.operacionesService.findOneNotaOperacion(id);
  }

  @Post('notas-operacion')
  @ApiOperation({ summary: 'Crear nota de operación' })
  createNotaOperacion(@Body() dto: CreateNotaOperacionDto) {
    return this.operacionesService.createNotaOperacion(dto);
  }

  @Put('notas-operacion/:id')
  @ApiOperation({ summary: 'Actualizar nota de operación' })
  updateNotaOperacion(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateNotaOperacionDto) {
    return this.operacionesService.updateNotaOperacion(id, dto);
  }

  @Delete('notas-operacion/:id')
  @ApiOperation({ summary: 'Eliminar nota de operación' })
  removeNotaOperacion(@Param('id', ParseIntPipe) id: number) {
    return this.operacionesService.removeNotaOperacion(id);
  }

  // ── PANEL DE OPERACIONES ──
  @Get('panel')
  @ApiOperation({ summary: 'Panel de operaciones del aeropuerto activo' })
  @ApiQuery({ name: 'estado', required: false, type: String })
  findOperacionesPanel(
    @CurrentUser('idAeropuertoActivo') idAeropuerto: number,
    @Query('estado') estado?: string,
  ) {
    return this.operacionesService.findOperacionesPanel(idAeropuerto, estado);
  }

  // ── CÁLCULO DE CONCEPTOS ──
  @Post('calcular-conceptos')
  @ApiOperation({ summary: 'Calcular conceptos de facturación' })
  calcularConceptos(@Body() dto: CalcularConceptosDto) {
    return this.calculosService.calcularConceptos(dto);
  }
}
