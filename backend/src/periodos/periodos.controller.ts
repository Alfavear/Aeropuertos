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
import { PeriodosService } from './periodos.service';
import { CreatePeriodoDto } from './dto/create-periodo.dto';
import { UpdatePeriodoDto } from './dto/update-periodo.dto';
import { CreatePeriodoAeropuertoDto } from './dto/create-periodo-aeropuerto.dto';
import { UpdatePeriodoAeropuertoDto } from './dto/update-periodo-aeropuerto.dto';
import { CreateDiaAeropuertoDto } from './dto/create-dia-aeropuerto.dto';
import { UpdateDiaAeropuertoDto } from './dto/update-dia-aeropuerto.dto';
import { CreateDiaFeriadoDto } from './dto/create-dia-feriado.dto';
import { UpdateDiaFeriadoDto } from './dto/update-dia-feriado.dto';
import { AbrirPeriodoDto } from './dto/abrir-periodo.dto';
import { CerrarPeriodoDto } from './dto/cerrar-periodo.dto';

@ApiTags('Períodos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('periodos')
export class PeriodosController {
  constructor(private readonly periodosService: PeriodosService) {}

  // ============================================================
  // PERIODOS
  // ============================================================

  @Get()
  @ApiOperation({ summary: 'Listar períodos' })
  @ApiQuery({ name: 'estado', required: false, type: String, description: 'Filtrar por estado (A=Abierto, C=Cerrado)' })
  findAllPeriodos(@Query('estado') estado?: string) {
    return this.periodosService.findAllPeriodos(estado);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener período por ID' })
  findOnePeriodo(@Param('id', ParseIntPipe) id: number) {
    return this.periodosService.findOnePeriodo(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear período' })
  createPeriodo(@Body() dto: CreatePeriodoDto) {
    return this.periodosService.createPeriodo(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar período' })
  updatePeriodo(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePeriodoDto,
  ) {
    return this.periodosService.updatePeriodo(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar período' })
  removePeriodo(@Param('id', ParseIntPipe) id: number) {
    return this.periodosService.removePeriodo(id);
  }

  // ============================================================
  // PERIODOS AEROPUERTO
  // ============================================================

  @Get('periodos-aeropuerto')
  @ApiOperation({ summary: 'Listar relaciones período-aeropuerto' })
  @ApiQuery({ name: 'idAeropuerto', required: false, type: Number })
  @ApiQuery({ name: 'idPeriodo', required: false, type: Number })
  @ApiQuery({ name: 'abierto', required: false, type: String })
  findAllPeriodosAeropuerto(
    @Query('idAeropuerto') idAeropuerto?: string,
    @Query('idPeriodo') idPeriodo?: string,
    @Query('abierto') abierto?: string,
  ) {
    return this.periodosService.findAllPeriodosAeropuerto({
      idAeropuerto: idAeropuerto ? parseInt(idAeropuerto, 10) : undefined,
      idPeriodo: idPeriodo ? parseInt(idPeriodo, 10) : undefined,
      abierto,
    });
  }

  @Get('periodos-aeropuerto/:idAeropuerto/:idPeriodo')
  @ApiOperation({ summary: 'Obtener relación período-aeropuerto por compound key' })
  findOnePeriodoAeropuerto(
    @Param('idAeropuerto', ParseIntPipe) idAeropuerto: number,
    @Param('idPeriodo', ParseIntPipe) idPeriodo: number,
  ) {
    return this.periodosService.findOnePeriodoAeropuerto(idAeropuerto, idPeriodo);
  }

  @Post('periodos-aeropuerto')
  @ApiOperation({ summary: 'Crear relación período-aeropuerto' })
  createPeriodoAeropuerto(@Body() dto: CreatePeriodoAeropuertoDto) {
    return this.periodosService.createPeriodoAeropuerto(dto);
  }

  @Put('periodos-aeropuerto/:idAeropuerto/:idPeriodo')
  @ApiOperation({ summary: 'Actualizar relación período-aeropuerto' })
  updatePeriodoAeropuerto(
    @Param('idAeropuerto', ParseIntPipe) idAeropuerto: number,
    @Param('idPeriodo', ParseIntPipe) idPeriodo: number,
    @Body() dto: UpdatePeriodoAeropuertoDto,
  ) {
    return this.periodosService.updatePeriodoAeropuerto(idAeropuerto, idPeriodo, dto);
  }

  @Delete('periodos-aeropuerto/:idAeropuerto/:idPeriodo')
  @ApiOperation({ summary: 'Eliminar relación período-aeropuerto' })
  removePeriodoAeropuerto(
    @Param('idAeropuerto', ParseIntPipe) idAeropuerto: number,
    @Param('idPeriodo', ParseIntPipe) idPeriodo: number,
  ) {
    return this.periodosService.removePeriodoAeropuerto(idAeropuerto, idPeriodo);
  }

  @Patch('periodos-aeropuerto/:idAeropuerto/:idPeriodo/abrir')
  @ApiOperation({ summary: 'Abrir período de aeropuerto' })
  abrirPeriodoAeropuerto(
    @Param('idAeropuerto', ParseIntPipe) idAeropuerto: number,
    @Param('idPeriodo', ParseIntPipe) idPeriodo: number,
    @Body() _dto: AbrirPeriodoDto,
  ) {
    return this.periodosService.abrirPeriodoAeropuerto(idAeropuerto, idPeriodo);
  }

  @Patch('periodos-aeropuerto/:idAeropuerto/:idPeriodo/cerrar')
  @ApiOperation({ summary: 'Cerrar período de aeropuerto' })
  cerrarPeriodoAeropuerto(
    @Param('idAeropuerto', ParseIntPipe) idAeropuerto: number,
    @Param('idPeriodo', ParseIntPipe) idPeriodo: number,
    @Body() _dto: CerrarPeriodoDto,
  ) {
    return this.periodosService.cerrarPeriodoAeropuerto(idAeropuerto, idPeriodo);
  }

  // ============================================================
  // DIAS AEROPUERTO
  // ============================================================

  @Get('dias-aeropuerto')
  @ApiOperation({ summary: 'Listar días de aeropuerto' })
  @ApiQuery({ name: 'idPeriodo', required: false, type: Number })
  @ApiQuery({ name: 'idAeropuerto', required: false, type: Number })
  @ApiQuery({ name: 'abierto', required: false, type: String })
  findAllDiasAeropuerto(
    @Query('idPeriodo') idPeriodo?: string,
    @Query('idAeropuerto') idAeropuerto?: string,
    @Query('abierto') abierto?: string,
  ) {
    return this.periodosService.findAllDiasAeropuerto({
      idPeriodo: idPeriodo ? parseInt(idPeriodo, 10) : undefined,
      idAeropuerto: idAeropuerto ? parseInt(idAeropuerto, 10) : undefined,
      abierto,
    });
  }

  @Get('dias-aeropuerto/:idPeriodo/:dia')
  @ApiOperation({ summary: 'Obtener día de aeropuerto por compound key' })
  findOneDiaAeropuerto(
    @Param('idPeriodo', ParseIntPipe) idPeriodo: number,
    @Param('dia') dia: string,
  ) {
    return this.periodosService.findOneDiaAeropuerto(idPeriodo, new Date(dia));
  }

  @Post('dias-aeropuerto')
  @ApiOperation({ summary: 'Crear día de aeropuerto' })
  createDiaAeropuerto(@Body() dto: CreateDiaAeropuertoDto) {
    return this.periodosService.createDiaAeropuerto(dto);
  }

  @Put('dias-aeropuerto/:idPeriodo/:dia')
  @ApiOperation({ summary: 'Actualizar día de aeropuerto' })
  updateDiaAeropuerto(
    @Param('idPeriodo', ParseIntPipe) idPeriodo: number,
    @Param('dia') dia: string,
    @Body() dto: UpdateDiaAeropuertoDto,
  ) {
    return this.periodosService.updateDiaAeropuerto(idPeriodo, new Date(dia), dto);
  }

  @Delete('dias-aeropuerto/:idPeriodo/:dia')
  @ApiOperation({ summary: 'Eliminar día de aeropuerto' })
  removeDiaAeropuerto(
    @Param('idPeriodo', ParseIntPipe) idPeriodo: number,
    @Param('dia') dia: string,
  ) {
    return this.periodosService.removeDiaAeropuerto(idPeriodo, new Date(dia));
  }

  @Patch('dias-aeropuerto/:idPeriodo/:dia/abrir')
  @ApiOperation({ summary: 'Abrir día de aeropuerto' })
  abrirDia(
    @Param('idPeriodo', ParseIntPipe) idPeriodo: number,
    @Param('dia') dia: string,
  ) {
    return this.periodosService.abrirDia(idPeriodo, new Date(dia));
  }

  @Patch('dias-aeropuerto/:idPeriodo/:dia/cerrar')
  @ApiOperation({ summary: 'Cerrar día de aeropuerto' })
  cerrarDia(
    @Param('idPeriodo', ParseIntPipe) idPeriodo: number,
    @Param('dia') dia: string,
  ) {
    return this.periodosService.cerrarDia(idPeriodo, new Date(dia));
  }

  // ============================================================
  // DIAS FERIADOS
  // ============================================================

  @Get('dias-feriados')
  @ApiOperation({ summary: 'Listar días feriados' })
  findAllDiasFeriados() {
    return this.periodosService.findAllDiasFeriados();
  }

  @Get('dias-feriados/:id')
  @ApiOperation({ summary: 'Obtener día feriado por ID' })
  findOneDiaFeriado(@Param('id', ParseIntPipe) id: number) {
    return this.periodosService.findOneDiaFeriado(id);
  }

  @Post('dias-feriados')
  @ApiOperation({ summary: 'Crear día feriado' })
  createDiaFeriado(@Body() dto: CreateDiaFeriadoDto) {
    return this.periodosService.createDiaFeriado(dto);
  }

  @Put('dias-feriados/:id')
  @ApiOperation({ summary: 'Actualizar día feriado' })
  updateDiaFeriado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDiaFeriadoDto,
  ) {
    return this.periodosService.updateDiaFeriado(id, dto);
  }

  @Delete('dias-feriados/:id')
  @ApiOperation({ summary: 'Eliminar día feriado' })
  removeDiaFeriado(@Param('id', ParseIntPipe) id: number) {
    return this.periodosService.removeDiaFeriado(id);
  }

  @Get('dias-feriados/verificar/:fecha')
  @ApiOperation({ summary: 'Verificar si una fecha es feriado' })
  esFeriado(@Param('fecha') fecha: string) {
    return this.periodosService.esFeriado(fecha);
  }
}
