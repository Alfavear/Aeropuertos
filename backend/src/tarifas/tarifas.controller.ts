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
import { TarifasService } from './tarifas.service';
import { CreateConceptoDto } from './dto/create-concepto.dto';
import { UpdateConceptoDto } from './dto/update-concepto.dto';
import { CreateGrupoConceptoDto } from './dto/create-grupo-concepto.dto';
import { UpdateGrupoConceptoDto } from './dto/update-grupo-concepto.dto';
import { CreateTipoOperacionDto } from './dto/create-tipo-operacion.dto';
import { UpdateTipoOperacionDto } from './dto/update-tipo-operacion.dto';
import { CreateTarifaOperacionDto } from './dto/create-tarifa-operacion.dto';
import { UpdateTarifaOperacionDto } from './dto/update-tarifa-operacion.dto';
import { CreateTarifaAerolineaDto } from './dto/create-tarifa-aerolinea.dto';
import { UpdateTarifaAerolineaDto } from './dto/update-tarifa-aerolinea.dto';
import { CreateImpuestoDto } from './dto/create-impuesto.dto';
import { UpdateImpuestoDto } from './dto/update-impuesto.dto';

@ApiTags('Tarifas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tarifas')
export class TarifasController {
  constructor(private readonly tarifasService: TarifasService) {}

  // ============================================================
  // CONCEPTOS
  // ============================================================

  @Get('conceptos')
  @ApiOperation({ summary: 'Listar conceptos' })
  @ApiQuery({ name: 'activo', required: false, type: String, description: 'Filtrar por activo (true/false)' })
  @ApiQuery({ name: 'idGrupoConcepto', required: false, type: Number, description: 'Filtrar por grupo' })
  @ApiQuery({ name: 'skip', required: false, type: Number, description: 'Número de registros a saltar (paginación)' })
  @ApiQuery({ name: 'take', required: false, type: Number, description: 'Número de registros a tomar (paginación)' })
  findAllConceptos(
    @Query('activo') activo?: string,
    @Query('idGrupoConcepto') idGrupoConcepto?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.tarifasService.findAllConceptos({ activo, idGrupoConcepto, skip, take });
  }

  @Get('conceptos/:id')
  @ApiOperation({ summary: 'Obtener concepto por ID' })
  findOneConcepto(@Param('id', ParseIntPipe) id: number) {
    return this.tarifasService.findOneConcepto(id);
  }

  @Post('conceptos')
  @ApiOperation({ summary: 'Crear concepto' })
  createConcepto(@Body() dto: CreateConceptoDto) {
    return this.tarifasService.createConcepto(dto);
  }

  @Put('conceptos/:id')
  @ApiOperation({ summary: 'Actualizar concepto' })
  updateConcepto(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateConceptoDto,
  ) {
    return this.tarifasService.updateConcepto(id, dto);
  }

  @Delete('conceptos/:id')
  @ApiOperation({ summary: 'Eliminar concepto' })
  removeConcepto(@Param('id', ParseIntPipe) id: number) {
    return this.tarifasService.removeConcepto(id);
  }

  // ============================================================
  // GRUPOS CONCEPTO
  // ============================================================

  @Get('grupos-concepto')
  @ApiOperation({ summary: 'Listar grupos de concepto' })
  findAllGruposConcepto() {
    return this.tarifasService.findAllGruposConcepto();
  }

  @Get('grupos-concepto/:id')
  @ApiOperation({ summary: 'Obtener grupo de concepto por ID' })
  findOneGrupoConcepto(@Param('id', ParseIntPipe) id: number) {
    return this.tarifasService.findOneGrupoConcepto(id);
  }

  @Post('grupos-concepto')
  @ApiOperation({ summary: 'Crear grupo de concepto' })
  createGrupoConcepto(@Body() dto: CreateGrupoConceptoDto) {
    return this.tarifasService.createGrupoConcepto(dto);
  }

  @Put('grupos-concepto/:id')
  @ApiOperation({ summary: 'Actualizar grupo de concepto' })
  updateGrupoConcepto(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGrupoConceptoDto,
  ) {
    return this.tarifasService.updateGrupoConcepto(id, dto);
  }

  @Delete('grupos-concepto/:id')
  @ApiOperation({ summary: 'Eliminar grupo de concepto' })
  removeGrupoConcepto(@Param('id', ParseIntPipe) id: number) {
    return this.tarifasService.removeGrupoConcepto(id);
  }

  // ============================================================
  // TIPOS OPERACION
  // ============================================================

  @Get('tipos-operacion')
  @ApiOperation({ summary: 'Listar tipos de operación' })
  @ApiQuery({ name: 'idConcepto', required: false, type: Number, description: 'Filtrar por concepto' })
  @ApiQuery({ name: 'tipoTarifa', required: false, type: Number, description: 'Filtrar por tipo de tarifa' })
  findAllTiposOperacion(
    @Query('idConcepto') idConcepto?: string,
    @Query('tipoTarifa') tipoTarifa?: string,
  ) {
    return this.tarifasService.findAllTiposOperacion({ idConcepto, tipoTarifa });
  }

  @Get('tipos-operacion/:id')
  @ApiOperation({ summary: 'Obtener tipo de operación por ID' })
  findOneTipoOperacion(@Param('id', ParseIntPipe) id: number) {
    return this.tarifasService.findOneTipoOperacion(id);
  }

  @Post('tipos-operacion')
  @ApiOperation({ summary: 'Crear tipo de operación' })
  createTipoOperacion(@Body() dto: CreateTipoOperacionDto) {
    return this.tarifasService.createTipoOperacion(dto);
  }

  @Put('tipos-operacion/:id')
  @ApiOperation({ summary: 'Actualizar tipo de operación' })
  updateTipoOperacion(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTipoOperacionDto,
  ) {
    return this.tarifasService.updateTipoOperacion(id, dto);
  }

  @Delete('tipos-operacion/:id')
  @ApiOperation({ summary: 'Eliminar tipo de operación' })
  removeTipoOperacion(@Param('id', ParseIntPipe) id: number) {
    return this.tarifasService.removeTipoOperacion(id);
  }

  // ============================================================
  // TARIFAS OPERACION
  // ============================================================

  @Get('tarifas-operacion')
  @ApiOperation({ summary: 'Listar tarifas de operación' })
  @ApiQuery({ name: 'idTipoOperacion', required: false, type: Number, description: 'Filtrar por tipo de operación' })
  @ApiQuery({ name: 'idAeropuerto', required: false, type: Number, description: 'Filtrar por aeropuerto' })
  @ApiQuery({ name: 'rango', required: false, type: String, description: "Filtrar por rango (S/R)" })
  findAllTarifasOperacion(
    @Query('idTipoOperacion') idTipoOperacion?: string,
    @Query('idAeropuerto') idAeropuerto?: string,
    @Query('rango') rango?: string,
  ) {
    return this.tarifasService.findAllTarifasOperacion({ idTipoOperacion, idAeropuerto, rango });
  }

  @Get('tarifas-operacion/:id')
  @ApiOperation({ summary: 'Obtener tarifa de operación por ID' })
  findOneTarifaOperacion(@Param('id', ParseIntPipe) id: number) {
    return this.tarifasService.findOneTarifaOperacion(id);
  }

  @Post('tarifas-operacion')
  @ApiOperation({ summary: 'Crear tarifa de operación' })
  createTarifaOperacion(@Body() dto: CreateTarifaOperacionDto) {
    return this.tarifasService.createTarifaOperacion(dto);
  }

  @Put('tarifas-operacion/:id')
  @ApiOperation({ summary: 'Actualizar tarifa de operación' })
  updateTarifaOperacion(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTarifaOperacionDto,
  ) {
    return this.tarifasService.updateTarifaOperacion(id, dto);
  }

  @Delete('tarifas-operacion/:id')
  @ApiOperation({ summary: 'Eliminar tarifa de operación' })
  removeTarifaOperacion(@Param('id', ParseIntPipe) id: number) {
    return this.tarifasService.removeTarifaOperacion(id);
  }

  // ============================================================
  // TARIFAS AEROLINEA
  // ============================================================

  @Get('tarifas-aerolinea')
  @ApiOperation({ summary: 'Listar tarifas de aerolínea' })
  @ApiQuery({ name: 'idTarifaOperacion', required: false, type: Number, description: 'Filtrar por tarifa de operación' })
  @ApiQuery({ name: 'idAerolinea', required: false, type: Number, description: 'Filtrar por aerolínea' })
  findAllTarifasAerolinea(
    @Query('idTarifaOperacion') idTarifaOperacion?: string,
    @Query('idAerolinea') idAerolinea?: string,
  ) {
    return this.tarifasService.findAllTarifasAerolinea({ idTarifaOperacion, idAerolinea });
  }

  @Get('tarifas-aerolinea/:id')
  @ApiOperation({ summary: 'Obtener tarifa de aerolínea por ID' })
  findOneTarifaAerolinea(@Param('id', ParseIntPipe) id: number) {
    return this.tarifasService.findOneTarifaAerolinea(id);
  }

  @Post('tarifas-aerolinea')
  @ApiOperation({ summary: 'Crear tarifa de aerolínea' })
  createTarifaAerolinea(@Body() dto: CreateTarifaAerolineaDto) {
    return this.tarifasService.createTarifaAerolinea(dto);
  }

  @Put('tarifas-aerolinea/:id')
  @ApiOperation({ summary: 'Actualizar tarifa de aerolínea' })
  updateTarifaAerolinea(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTarifaAerolineaDto,
  ) {
    return this.tarifasService.updateTarifaAerolinea(id, dto);
  }

  @Delete('tarifas-aerolinea/:id')
  @ApiOperation({ summary: 'Eliminar tarifa de aerolínea' })
  removeTarifaAerolinea(@Param('id', ParseIntPipe) id: number) {
    return this.tarifasService.removeTarifaAerolinea(id);
  }

  // ============================================================
  // IMPUESTOS
  // ============================================================

  @Get('impuestos')
  @ApiOperation({ summary: 'Listar impuestos' })
  findAllImpuestos() {
    return this.tarifasService.findAllImpuestos();
  }

  @Get('impuestos/:codigo')
  @ApiOperation({ summary: 'Obtener impuesto por código' })
  findOneImpuesto(@Param('codigo') codigo: string) {
    return this.tarifasService.findOneImpuesto(codigo);
  }

  @Post('impuestos')
  @ApiOperation({ summary: 'Crear impuesto' })
  createImpuesto(@Body() dto: CreateImpuestoDto) {
    return this.tarifasService.createImpuesto(dto);
  }

  @Put('impuestos/:codigo')
  @ApiOperation({ summary: 'Actualizar impuesto' })
  updateImpuesto(
    @Param('codigo') codigo: string,
    @Body() dto: UpdateImpuestoDto,
  ) {
    return this.tarifasService.updateImpuesto(codigo, dto);
  }

  @Delete('impuestos/:codigo')
  @ApiOperation({ summary: 'Eliminar impuesto' })
  removeImpuesto(@Param('codigo') codigo: string) {
    return this.tarifasService.removeImpuesto(codigo);
  }
}
