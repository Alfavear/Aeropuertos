import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrganizacionService } from './organizacion.service';
import { CreatePaisDto } from './dto/create-pais.dto';
import { UpdatePaisDto } from './dto/update-pais.dto';
import { CreateCiudadDto } from './dto/create-ciudad.dto';
import { UpdateCiudadDto } from './dto/update-ciudad.dto';
import { CreateAeropuertoDto } from './dto/create-aeropuerto.dto';
import { UpdateAeropuertoDto } from './dto/update-aeropuerto.dto';
import { CreateZonaDto } from './dto/create-zona.dto';
import { UpdateZonaDto } from './dto/update-zona.dto';
import { CreateZonaAeropuertoDto } from './dto/create-zona-aeropuerto.dto';
import { UpdateZonaAeropuertoDto } from './dto/update-zona-aeropuerto.dto';
import { CreateHorarioAeropuertoDto } from './dto/create-horario-aeropuerto.dto';
import { UpdateHorarioAeropuertoDto } from './dto/update-horario-aeropuerto.dto';

@ApiTags('Organización')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('organizacion')
export class OrganizacionController {
  constructor(private readonly organizacionService: OrganizacionService) {}

  // ============================================================
  // PAISES
  // ============================================================

  @Get('paises')
  @ApiOperation({ summary: 'Listar países' })
  findAllPaises() {
    return this.organizacionService.findAllPaises();
  }

  @Get('paises/:id')
  @ApiOperation({ summary: 'Obtener país por ID' })
  findOnePais(@Param('id', ParseIntPipe) id: number) {
    return this.organizacionService.findOnePais(id);
  }

  @Post('paises')
  @ApiOperation({ summary: 'Crear país' })
  createPais(@Body() dto: CreatePaisDto) {
    return this.organizacionService.createPais(dto);
  }

  @Put('paises/:id')
  @ApiOperation({ summary: 'Actualizar país' })
  updatePais(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePaisDto,
  ) {
    return this.organizacionService.updatePais(id, dto);
  }

  @Delete('paises/:id')
  @ApiOperation({ summary: 'Eliminar país' })
  removePais(@Param('id', ParseIntPipe) id: number) {
    return this.organizacionService.removePais(id);
  }

  // ============================================================
  // CIUDADES
  // ============================================================

  @Get('ciudades')
  @ApiOperation({ summary: 'Listar ciudades' })
  findAllCiudades() {
    return this.organizacionService.findAllCiudades();
  }

  @Get('ciudades/:id')
  @ApiOperation({ summary: 'Obtener ciudad por ID' })
  findOneCiudad(@Param('id', ParseIntPipe) id: number) {
    return this.organizacionService.findOneCiudad(id);
  }

  @Post('ciudades')
  @ApiOperation({ summary: 'Crear ciudad' })
  createCiudad(@Body() dto: CreateCiudadDto) {
    return this.organizacionService.createCiudad(dto);
  }

  @Put('ciudades/:id')
  @ApiOperation({ summary: 'Actualizar ciudad' })
  updateCiudad(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCiudadDto,
  ) {
    return this.organizacionService.updateCiudad(id, dto);
  }

  @Delete('ciudades/:id')
  @ApiOperation({ summary: 'Eliminar ciudad' })
  removeCiudad(@Param('id', ParseIntPipe) id: number) {
    return this.organizacionService.removeCiudad(id);
  }

  // ============================================================
  // AEROPUERTOS
  // ============================================================

  @Get('aeropuertos')
  @ApiOperation({ summary: 'Listar aeropuertos' })
  @ApiQuery({ name: 'idCiudad', required: false, type: Number })
  @ApiQuery({ name: 'idZona', required: false, type: Number })
  findAllAeropuertos(
    @Query('idCiudad') idCiudad?: string,
    @Query('idZona') idZona?: string,
  ) {
    return this.organizacionService.findAllAeropuertos({
      idCiudad: idCiudad ? parseInt(idCiudad, 10) : undefined,
      idZona: idZona ? parseInt(idZona, 10) : undefined,
    });
  }

  @Get('aeropuertos/:id')
  @ApiOperation({ summary: 'Obtener aeropuerto por ID' })
  findOneAeropuerto(@Param('id', ParseIntPipe) id: number) {
    return this.organizacionService.findOneAeropuerto(id);
  }

  @Post('aeropuertos')
  @ApiOperation({ summary: 'Crear aeropuerto' })
  createAeropuerto(@Body() dto: CreateAeropuertoDto) {
    return this.organizacionService.createAeropuerto(dto);
  }

  @Put('aeropuertos/:id')
  @ApiOperation({ summary: 'Actualizar aeropuerto' })
  updateAeropuerto(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAeropuertoDto,
  ) {
    return this.organizacionService.updateAeropuerto(id, dto);
  }

  @Delete('aeropuertos/:id')
  @ApiOperation({ summary: 'Eliminar aeropuerto' })
  removeAeropuerto(@Param('id', ParseIntPipe) id: number) {
    return this.organizacionService.removeAeropuerto(id);
  }

  // ============================================================
  // ZONAS
  // ============================================================

  @Get('zonas')
  @ApiOperation({ summary: 'Listar zonas' })
  findAllZonas() {
    return this.organizacionService.findAllZonas();
  }

  @Get('zonas/:id')
  @ApiOperation({ summary: 'Obtener zona por ID' })
  findOneZona(@Param('id', ParseIntPipe) id: number) {
    return this.organizacionService.findOneZona(id);
  }

  @Post('zonas')
  @ApiOperation({ summary: 'Crear zona' })
  createZona(@Body() dto: CreateZonaDto) {
    return this.organizacionService.createZona(dto);
  }

  @Put('zonas/:id')
  @ApiOperation({ summary: 'Actualizar zona' })
  updateZona(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateZonaDto,
  ) {
    return this.organizacionService.updateZona(id, dto);
  }

  @Delete('zonas/:id')
  @ApiOperation({ summary: 'Eliminar zona' })
  removeZona(@Param('id', ParseIntPipe) id: number) {
    return this.organizacionService.removeZona(id);
  }

  // ============================================================
  // ZONAS AEROPUERTO
  // ============================================================

  @Get('zonas-aeropuerto')
  @ApiOperation({ summary: 'Listar zonas de aeropuerto' })
  findAllZonasAeropuerto() {
    return this.organizacionService.findAllZonasAeropuerto();
  }

  @Get('zonas-aeropuerto/:id')
  @ApiOperation({ summary: 'Obtener zona de aeropuerto por ID' })
  findOneZonaAeropuerto(@Param('id', ParseIntPipe) id: number) {
    return this.organizacionService.findOneZonaAeropuerto(id);
  }

  @Post('zonas-aeropuerto')
  @ApiOperation({ summary: 'Crear zona de aeropuerto' })
  createZonaAeropuerto(@Body() dto: CreateZonaAeropuertoDto) {
    return this.organizacionService.createZonaAeropuerto(dto);
  }

  @Put('zonas-aeropuerto/:id')
  @ApiOperation({ summary: 'Actualizar zona de aeropuerto' })
  updateZonaAeropuerto(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateZonaAeropuertoDto,
  ) {
    return this.organizacionService.updateZonaAeropuerto(id, dto);
  }

  @Delete('zonas-aeropuerto/:id')
  @ApiOperation({ summary: 'Eliminar zona de aeropuerto' })
  removeZonaAeropuerto(@Param('id', ParseIntPipe) id: number) {
    return this.organizacionService.removeZonaAeropuerto(id);
  }

  // ============================================================
  // HORARIOS AEROPUERTO
  // ============================================================

  @Get('horarios-aeropuerto')
  @ApiOperation({ summary: 'Listar horarios de aeropuerto' })
  findAllHorariosAeropuerto() {
    return this.organizacionService.findAllHorariosAeropuerto();
  }

  @Get('horarios-aeropuerto/:id')
  @ApiOperation({ summary: 'Obtener horario de aeropuerto por ID' })
  findOneHorarioAeropuerto(@Param('id', ParseIntPipe) id: number) {
    return this.organizacionService.findOneHorarioAeropuerto(id);
  }

  @Post('horarios-aeropuerto')
  @ApiOperation({ summary: 'Crear horario de aeropuerto' })
  createHorarioAeropuerto(@Body() dto: CreateHorarioAeropuertoDto) {
    return this.organizacionService.createHorarioAeropuerto(dto);
  }

  @Put('horarios-aeropuerto/:id')
  @ApiOperation({ summary: 'Actualizar horario de aeropuerto' })
  updateHorarioAeropuerto(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHorarioAeropuertoDto,
  ) {
    return this.organizacionService.updateHorarioAeropuerto(id, dto);
  }

  @Delete('horarios-aeropuerto/:id')
  @ApiOperation({ summary: 'Eliminar horario de aeropuerto' })
  removeHorarioAeropuerto(@Param('id', ParseIntPipe) id: number) {
    return this.organizacionService.removeHorarioAeropuerto(id);
  }
}
