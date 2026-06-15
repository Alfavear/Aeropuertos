import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LiquidacionesService } from './liquidaciones.service';
import { CreateLiquidacionDto } from './dto/create-liquidacion.dto';
import { UpdateLiquidacionDto } from './dto/update-liquidacion.dto';
import { CreateItemLiquidacionDto } from './dto/create-item-liquidacion.dto';
import { UpdateItemLiquidacionDto } from './dto/update-item-liquidacion.dto';
import { CreatePasajeroNacionalDto } from './dto/create-pasajero-nacional.dto';
import { UpdatePasajeroNacionalDto } from './dto/update-pasajero-nacional.dto';
import { CreatePasajeroInternacionalDto } from './dto/create-pasajero-internacional.dto';
import { UpdatePasajeroInternacionalDto } from './dto/update-pasajero-internacional.dto';
import { CreateTasaDto } from './dto/create-tasa.dto';
import { UpdateTasaDto } from './dto/update-tasa.dto';
import { CreateTipoPasajeroDto } from './dto/create-tipo-pasajero.dto';
import { UpdateTipoPasajeroDto } from './dto/update-tipo-pasajero.dto';
import { CreateClasePasajeroDto } from './dto/create-clase-pasajero.dto';
import { UpdateClasePasajeroDto } from './dto/update-clase-pasajero.dto';

@ApiTags('Liquidaciones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('liquidaciones')
export class LiquidacionesController {
  constructor(private readonly liquidacionesService: LiquidacionesService) {}

  // ============================================================
  // LIQUIDACIONES
  // ============================================================

  @Get()
  @ApiOperation({ summary: 'Listar liquidaciones' })
  @ApiQuery({ name: 'idAeropuerto', required: false, type: Number, description: 'Filtrar por aeropuerto' })
  @ApiQuery({ name: 'idAerolinea', required: false, type: Number, description: 'Filtrar por aerolínea' })
  @ApiQuery({ name: 'estado', required: false, type: String, description: 'Filtrar por estado' })
  @ApiQuery({ name: 'skip', required: false, type: Number, description: 'Número de registros a saltar (paginación)' })
  @ApiQuery({ name: 'take', required: false, type: Number, description: 'Número de registros a tomar (paginación)' })
  findAll(
    @Query('idAeropuerto') idAeropuerto?: string,
    @Query('idAerolinea') idAerolinea?: string,
    @Query('estado') estado?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.liquidacionesService.findAllLiquidaciones({ idAeropuerto, idAerolinea, estado, skip, take });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener liquidación por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.liquidacionesService.findOneLiquidacion(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear liquidación' })
  create(@Body() dto: CreateLiquidacionDto) {
    return this.liquidacionesService.createLiquidacion(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar liquidación' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLiquidacionDto,
  ) {
    return this.liquidacionesService.updateLiquidacion(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar liquidación (solo si no tiene items)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.liquidacionesService.removeLiquidacion(id);
  }

  // ============================================================
  // ITEMS LIQUIDACION
  // ============================================================

  @Get('items-liquidacion')
  @ApiOperation({ summary: 'Listar items de liquidación' })
  @ApiQuery({ name: 'idLiquidacion', required: false, type: Number, description: 'Filtrar por liquidación' })
  findAllItems(
    @Query('idLiquidacion') idLiquidacion?: string,
  ) {
    return this.liquidacionesService.findAllItemsLiquidacion({ idLiquidacion });
  }

  @Get('items-liquidacion/:id')
  @ApiOperation({ summary: 'Obtener item de liquidación por ID' })
  findOneItem(@Param('id', ParseIntPipe) id: number) {
    return this.liquidacionesService.findOneItemLiquidacion(id);
  }

  @Post('items-liquidacion')
  @ApiOperation({ summary: 'Crear item de liquidación' })
  createItem(@Body() dto: CreateItemLiquidacionDto) {
    return this.liquidacionesService.createItemLiquidacion(dto);
  }

  @Put('items-liquidacion/:id')
  @ApiOperation({ summary: 'Actualizar item de liquidación' })
  updateItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateItemLiquidacionDto,
  ) {
    return this.liquidacionesService.updateItemLiquidacion(id, dto);
  }

  @Delete('items-liquidacion/:id')
  @ApiOperation({ summary: 'Eliminar item de liquidación' })
  removeItem(@Param('id', ParseIntPipe) id: number) {
    return this.liquidacionesService.removeItemLiquidacion(id);
  }

  // ============================================================
  // PASAJEROS NACIONALES
  // ============================================================

  @Get('pasajeros-nacionales')
  @ApiOperation({ summary: 'Listar pasajeros nacionales' })
  @ApiQuery({ name: 'idLiquidacion', required: false, type: Number, description: 'Filtrar por liquidación' })
  @ApiQuery({ name: 'idAerolinea', required: false, type: Number, description: 'Filtrar por aerolínea' })
  findAllPasajerosNacionales(
    @Query('idLiquidacion') idLiquidacion?: string,
    @Query('idAerolinea') idAerolinea?: string,
  ) {
    return this.liquidacionesService.findAllPasajerosNacionales({ idLiquidacion, idAerolinea });
  }

  @Get('pasajeros-nacionales/:id')
  @ApiOperation({ summary: 'Obtener pasajero nacional por ID' })
  findOnePasajeroNacional(@Param('id', ParseIntPipe) id: number) {
    return this.liquidacionesService.findOnePasajeroNacional(id);
  }

  @Post('pasajeros-nacionales')
  @ApiOperation({ summary: 'Crear pasajero nacional' })
  createPasajeroNacional(@Body() dto: CreatePasajeroNacionalDto) {
    return this.liquidacionesService.createPasajeroNacional(dto);
  }

  @Put('pasajeros-nacionales/:id')
  @ApiOperation({ summary: 'Actualizar pasajero nacional' })
  updatePasajeroNacional(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePasajeroNacionalDto,
  ) {
    return this.liquidacionesService.updatePasajeroNacional(id, dto);
  }

  @Delete('pasajeros-nacionales/:id')
  @ApiOperation({ summary: 'Eliminar pasajero nacional' })
  removePasajeroNacional(@Param('id', ParseIntPipe) id: number) {
    return this.liquidacionesService.removePasajeroNacional(id);
  }

  // ============================================================
  // PASAJEROS INTERNACIONALES
  // ============================================================

  @Get('pasajeros-internacionales')
  @ApiOperation({ summary: 'Listar pasajeros internacionales' })
  @ApiQuery({ name: 'idLiquidacion', required: false, type: Number, description: 'Filtrar por liquidación' })
  @ApiQuery({ name: 'idAerolinea', required: false, type: Number, description: 'Filtrar por aerolínea' })
  findAllPasajerosInternacionales(
    @Query('idLiquidacion') idLiquidacion?: string,
    @Query('idAerolinea') idAerolinea?: string,
  ) {
    return this.liquidacionesService.findAllPasajerosInternacionales({ idLiquidacion, idAerolinea });
  }

  @Get('pasajeros-internacionales/:id')
  @ApiOperation({ summary: 'Obtener pasajero internacional por ID' })
  findOnePasajeroInternacional(@Param('id', ParseIntPipe) id: number) {
    return this.liquidacionesService.findOnePasajeroInternacional(id);
  }

  @Post('pasajeros-internacionales')
  @ApiOperation({ summary: 'Crear pasajero internacional' })
  createPasajeroInternacional(@Body() dto: CreatePasajeroInternacionalDto) {
    return this.liquidacionesService.createPasajeroInternacional(dto);
  }

  @Put('pasajeros-internacionales/:id')
  @ApiOperation({ summary: 'Actualizar pasajero internacional' })
  updatePasajeroInternacional(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePasajeroInternacionalDto,
  ) {
    return this.liquidacionesService.updatePasajeroInternacional(id, dto);
  }

  @Delete('pasajeros-internacionales/:id')
  @ApiOperation({ summary: 'Eliminar pasajero internacional' })
  removePasajeroInternacional(@Param('id', ParseIntPipe) id: number) {
    return this.liquidacionesService.removePasajeroInternacional(id);
  }

  // ============================================================
  // TASAS
  // ============================================================

  @Get('tasas')
  @ApiOperation({ summary: 'Listar tasas' })
  findAllTasas() {
    return this.liquidacionesService.findAllTasas();
  }

  @Get('tasas/:id')
  @ApiOperation({ summary: 'Obtener tasa por ID' })
  findOneTasa(@Param('id', ParseIntPipe) id: number) {
    return this.liquidacionesService.findOneTasa(id);
  }

  @Post('tasas')
  @ApiOperation({ summary: 'Crear tasa' })
  createTasa(@Body() dto: CreateTasaDto) {
    return this.liquidacionesService.createTasa(dto);
  }

  @Put('tasas/:id')
  @ApiOperation({ summary: 'Actualizar tasa' })
  updateTasa(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTasaDto,
  ) {
    return this.liquidacionesService.updateTasa(id, dto);
  }

  @Delete('tasas/:id')
  @ApiOperation({ summary: 'Eliminar tasa' })
  removeTasa(@Param('id', ParseIntPipe) id: number) {
    return this.liquidacionesService.removeTasa(id);
  }

  // ============================================================
  // TIPOS PASAJERO
  // ============================================================

  @Get('tipos-pasajero')
  @ApiOperation({ summary: 'Listar tipos de pasajero' })
  @ApiQuery({ name: 'exento', required: false, type: String, description: 'Filtrar por exento (true/false)' })
  findAllTiposPasajero(
    @Query('exento') exento?: string,
  ) {
    return this.liquidacionesService.findAllTiposPasajero({ exento });
  }

  @Get('tipos-pasajero/:id')
  @ApiOperation({ summary: 'Obtener tipo de pasajero por ID' })
  findOneTipoPasajero(@Param('id', ParseIntPipe) id: number) {
    return this.liquidacionesService.findOneTipoPasajero(id);
  }

  @Post('tipos-pasajero')
  @ApiOperation({ summary: 'Crear tipo de pasajero' })
  createTipoPasajero(@Body() dto: CreateTipoPasajeroDto) {
    return this.liquidacionesService.createTipoPasajero(dto);
  }

  @Put('tipos-pasajero/:id')
  @ApiOperation({ summary: 'Actualizar tipo de pasajero' })
  updateTipoPasajero(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTipoPasajeroDto,
  ) {
    return this.liquidacionesService.updateTipoPasajero(id, dto);
  }

  @Delete('tipos-pasajero/:id')
  @ApiOperation({ summary: 'Eliminar tipo de pasajero' })
  removeTipoPasajero(@Param('id', ParseIntPipe) id: number) {
    return this.liquidacionesService.removeTipoPasajero(id);
  }

  // ============================================================
  // CLASES PASAJERO
  // ============================================================

  @Get('clases-pasajero')
  @ApiOperation({ summary: 'Listar clases de pasajero' })
  findAllClasesPasajero() {
    return this.liquidacionesService.findAllClasesPasajero();
  }

  @Get('clases-pasajero/:id')
  @ApiOperation({ summary: 'Obtener clase de pasajero por ID' })
  findOneClasePasajero(@Param('id', ParseIntPipe) id: number) {
    return this.liquidacionesService.findOneClasePasajero(id);
  }

  @Post('clases-pasajero')
  @ApiOperation({ summary: 'Crear clase de pasajero' })
  createClasePasajero(@Body() dto: CreateClasePasajeroDto) {
    return this.liquidacionesService.createClasePasajero(dto);
  }

  @Put('clases-pasajero/:id')
  @ApiOperation({ summary: 'Actualizar clase de pasajero' })
  updateClasePasajero(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateClasePasajeroDto,
  ) {
    return this.liquidacionesService.updateClasePasajero(id, dto);
  }

  @Delete('clases-pasajero/:id')
  @ApiOperation({ summary: 'Eliminar clase de pasajero (solo si no tiene tipos asociados)' })
  removeClasePasajero(@Param('id', ParseIntPipe) id: number) {
    return this.liquidacionesService.removeClasePasajero(id);
  }
}
