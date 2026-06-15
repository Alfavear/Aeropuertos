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
import { AerolineasService } from './aerolineas.service';
import { CreateAerolineaDto } from './dto/create-aerolinea.dto';
import { UpdateAerolineaDto } from './dto/update-aerolinea.dto';
import { CreateAeronaveDto } from './dto/create-aeronave.dto';
import { UpdateAeronaveDto } from './dto/update-aeronave.dto';
import { CreateTipoAeronaveDto } from './dto/create-tipo-aeronave.dto';
import { UpdateTipoAeronaveDto } from './dto/update-tipo-aeronave.dto';
import { CreateFabricanteDto } from './dto/create-fabricante.dto';
import { UpdateFabricanteDto } from './dto/update-fabricante.dto';
import { CreateClaseAviacionDto } from './dto/create-clase-aviacion.dto';
import { UpdateClaseAviacionDto } from './dto/update-clase-aviacion.dto';
import { CreatePersonalAerolineaDto } from './dto/create-personal-aerolinea.dto';
import { UpdatePersonalAerolineaDto } from './dto/update-personal-aerolinea.dto';
import { CreateAerolineaConceptoDto } from './dto/create-aerolinea-concepto.dto';
import { UpdateAerolineaConceptoDto } from './dto/update-aerolinea-concepto.dto';
import { CreateAerolineaConfigDto } from './dto/create-aerolinea-config.dto';
import { UpdateAerolineaConfigDto } from './dto/update-aerolinea-config.dto';

@ApiTags('Aerolíneas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('aerolineas')
export class AerolineasController {
  constructor(private readonly aerolineasService: AerolineasService) {}

  // ============================================================
  // AEROLINEAS
  // ============================================================

  @Get('aerolineas')
  @ApiOperation({ summary: 'Listar aerolíneas' })
  @ApiQuery({ name: 'activo', required: false, type: String })
  @ApiQuery({ name: 'nacional', required: false, type: String })
  @ApiQuery({ name: 'codigoOACI', required: false, type: String })
  @ApiQuery({ name: 'idCiudad', required: false, type: String })
  @ApiQuery({ name: 'idPais', required: false, type: String })
  findAllAerolineas(
    @Query('activo') activo?: string,
    @Query('nacional') nacional?: string,
    @Query('codigoOACI') codigoOACI?: string,
    @Query('idCiudad') idCiudad?: string,
    @Query('idPais') idPais?: string,
  ) {
    return this.aerolineasService.findAllAerolineas({ activo, nacional, codigoOACI, idCiudad, idPais });
  }

  @Get('aerolineas/:id')
  @ApiOperation({ summary: 'Obtener aerolínea por ID' })
  findOneAerolinea(@Param('id', ParseIntPipe) id: number) {
    return this.aerolineasService.findOneAerolinea(id);
  }

  @Post('aerolineas')
  @ApiOperation({ summary: 'Crear aerolínea' })
  createAerolinea(@Body() dto: CreateAerolineaDto) {
    return this.aerolineasService.createAerolinea(dto);
  }

  @Put('aerolineas/:id')
  @ApiOperation({ summary: 'Actualizar aerolínea' })
  updateAerolinea(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAerolineaDto,
  ) {
    return this.aerolineasService.updateAerolinea(id, dto);
  }

  @Delete('aerolineas/:id')
  @ApiOperation({ summary: 'Eliminar aerolínea' })
  removeAerolinea(@Param('id', ParseIntPipe) id: number) {
    return this.aerolineasService.removeAerolinea(id);
  }

  // ============================================================
  // AERONAVES
  // ============================================================

  @Get('aeronaves')
  @ApiOperation({ summary: 'Listar aeronaves' })
  @ApiQuery({ name: 'idAerolinea', required: false, type: String })
  @ApiQuery({ name: 'matricula', required: false, type: String })
  findAllAeronaves(
    @Query('idAerolinea') idAerolinea?: string,
    @Query('matricula') matricula?: string,
  ) {
    return this.aerolineasService.findAllAeronaves({ idAerolinea, matricula });
  }

  @Get('aeronaves/:id')
  @ApiOperation({ summary: 'Obtener aeronave por ID' })
  findOneAeronave(@Param('id', ParseIntPipe) id: number) {
    return this.aerolineasService.findOneAeronave(id);
  }

  @Post('aeronaves')
  @ApiOperation({ summary: 'Crear aeronave' })
  createAeronave(@Body() dto: CreateAeronaveDto) {
    return this.aerolineasService.createAeronave(dto);
  }

  @Put('aeronaves/:id')
  @ApiOperation({ summary: 'Actualizar aeronave' })
  updateAeronave(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAeronaveDto,
  ) {
    return this.aerolineasService.updateAeronave(id, dto);
  }

  @Delete('aeronaves/:id')
  @ApiOperation({ summary: 'Eliminar aeronave' })
  removeAeronave(@Param('id', ParseIntPipe) id: number) {
    return this.aerolineasService.removeAeronave(id);
  }

  // ============================================================
  // TIPOS AERONAVE
  // ============================================================

  @Get('tipos-aeronave')
  @ApiOperation({ summary: 'Listar tipos de aeronave' })
  @ApiQuery({ name: 'idFabricante', required: false, type: String })
  findAllTiposAeronave(@Query('idFabricante') idFabricante?: string) {
    return this.aerolineasService.findAllTiposAeronave({ idFabricante });
  }

  @Get('tipos-aeronave/:id')
  @ApiOperation({ summary: 'Obtener tipo de aeronave por ID' })
  findOneTipoAeronave(@Param('id', ParseIntPipe) id: number) {
    return this.aerolineasService.findOneTipoAeronave(id);
  }

  @Post('tipos-aeronave')
  @ApiOperation({ summary: 'Crear tipo de aeronave' })
  createTipoAeronave(@Body() dto: CreateTipoAeronaveDto) {
    return this.aerolineasService.createTipoAeronave(dto);
  }

  @Put('tipos-aeronave/:id')
  @ApiOperation({ summary: 'Actualizar tipo de aeronave' })
  updateTipoAeronave(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTipoAeronaveDto,
  ) {
    return this.aerolineasService.updateTipoAeronave(id, dto);
  }

  @Delete('tipos-aeronave/:id')
  @ApiOperation({ summary: 'Eliminar tipo de aeronave' })
  removeTipoAeronave(@Param('id', ParseIntPipe) id: number) {
    return this.aerolineasService.removeTipoAeronave(id);
  }

  // ============================================================
  // FABRICANTES
  // ============================================================

  @Get('fabricantes')
  @ApiOperation({ summary: 'Listar fabricantes' })
  findAllFabricantes() {
    return this.aerolineasService.findAllFabricantes();
  }

  @Get('fabricantes/:id')
  @ApiOperation({ summary: 'Obtener fabricante por ID' })
  findOneFabricante(@Param('id', ParseIntPipe) id: number) {
    return this.aerolineasService.findOneFabricante(id);
  }

  @Post('fabricantes')
  @ApiOperation({ summary: 'Crear fabricante' })
  createFabricante(@Body() dto: CreateFabricanteDto) {
    return this.aerolineasService.createFabricante(dto);
  }

  @Put('fabricantes/:id')
  @ApiOperation({ summary: 'Actualizar fabricante' })
  updateFabricante(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFabricanteDto,
  ) {
    return this.aerolineasService.updateFabricante(id, dto);
  }

  @Delete('fabricantes/:id')
  @ApiOperation({ summary: 'Eliminar fabricante' })
  removeFabricante(@Param('id', ParseIntPipe) id: number) {
    return this.aerolineasService.removeFabricante(id);
  }

  // ============================================================
  // CLASES AVIACION
  // ============================================================

  @Get('clases-aviacion')
  @ApiOperation({ summary: 'Listar clases de aviación' })
  findAllClasesAviacion() {
    return this.aerolineasService.findAllClasesAviacion();
  }

  @Get('clases-aviacion/:id')
  @ApiOperation({ summary: 'Obtener clase de aviación por ID' })
  findOneClaseAviacion(@Param('id', ParseIntPipe) id: number) {
    return this.aerolineasService.findOneClaseAviacion(id);
  }

  @Post('clases-aviacion')
  @ApiOperation({ summary: 'Crear clase de aviación' })
  createClaseAviacion(@Body() dto: CreateClaseAviacionDto) {
    return this.aerolineasService.createClaseAviacion(dto);
  }

  @Put('clases-aviacion/:id')
  @ApiOperation({ summary: 'Actualizar clase de aviación' })
  updateClaseAviacion(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateClaseAviacionDto,
  ) {
    return this.aerolineasService.updateClaseAviacion(id, dto);
  }

  @Delete('clases-aviacion/:id')
  @ApiOperation({ summary: 'Eliminar clase de aviación' })
  removeClaseAviacion(@Param('id', ParseIntPipe) id: number) {
    return this.aerolineasService.removeClaseAviacion(id);
  }

  // ============================================================
  // PERSONAL AEROLINEA
  // ============================================================

  @Get('personal-aerolinea')
  @ApiOperation({ summary: 'Listar personal de aerolínea' })
  @ApiQuery({ name: 'idAerolinea', required: false, type: String })
  findAllPersonalAerolinea(@Query('idAerolinea') idAerolinea?: string) {
    return this.aerolineasService.findAllPersonalAerolinea({ idAerolinea });
  }

  @Get('personal-aerolinea/:id')
  @ApiOperation({ summary: 'Obtener personal de aerolínea por ID' })
  findOnePersonalAerolinea(@Param('id', ParseIntPipe) id: number) {
    return this.aerolineasService.findOnePersonalAerolinea(id);
  }

  @Post('personal-aerolinea')
  @ApiOperation({ summary: 'Crear personal de aerolínea' })
  createPersonalAerolinea(@Body() dto: CreatePersonalAerolineaDto) {
    return this.aerolineasService.createPersonalAerolinea(dto);
  }

  @Put('personal-aerolinea/:id')
  @ApiOperation({ summary: 'Actualizar personal de aerolínea' })
  updatePersonalAerolinea(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePersonalAerolineaDto,
  ) {
    return this.aerolineasService.updatePersonalAerolinea(id, dto);
  }

  @Delete('personal-aerolinea/:id')
  @ApiOperation({ summary: 'Eliminar personal de aerolínea' })
  removePersonalAerolinea(@Param('id', ParseIntPipe) id: number) {
    return this.aerolineasService.removePersonalAerolinea(id);
  }

  // ============================================================
  // AEROLINEA CONCEPTOS
  // ============================================================

  @Get('aerolineas-conceptos')
  @ApiOperation({ summary: 'Listar relaciones aerolínea-concepto' })
  findAllAerolineasConceptos() {
    return this.aerolineasService.findAllAerolineasConceptos();
  }

  @Get('aerolineas-conceptos/:id')
  @ApiOperation({ summary: 'Obtener relación aerolínea-concepto por ID' })
  findOneAerolineaConcepto(@Param('id', ParseIntPipe) id: number) {
    return this.aerolineasService.findOneAerolineaConcepto(id);
  }

  @Post('aerolineas-conceptos')
  @ApiOperation({ summary: 'Crear relación aerolínea-concepto' })
  createAerolineaConcepto(@Body() dto: CreateAerolineaConceptoDto) {
    return this.aerolineasService.createAerolineaConcepto(dto);
  }

  @Put('aerolineas-conceptos/:id')
  @ApiOperation({ summary: 'Actualizar relación aerolínea-concepto' })
  updateAerolineaConcepto(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAerolineaConceptoDto,
  ) {
    return this.aerolineasService.updateAerolineaConcepto(id, dto);
  }

  @Delete('aerolineas-conceptos/:id')
  @ApiOperation({ summary: 'Eliminar relación aerolínea-concepto' })
  removeAerolineaConcepto(@Param('id', ParseIntPipe) id: number) {
    return this.aerolineasService.removeAerolineaConcepto(id);
  }

  // ============================================================
  // AEROLINEA CONFIG
  // ============================================================

  @Get('aerolineas-config')
  @ApiOperation({ summary: 'Listar configuraciones de aerolínea' })
  findAllAerolineasConfig() {
    return this.aerolineasService.findAllAerolineasConfig();
  }

  @Get('aerolineas-config/:id')
  @ApiOperation({ summary: 'Obtener configuración de aerolínea por ID' })
  findOneAerolineaConfig(@Param('id', ParseIntPipe) id: number) {
    return this.aerolineasService.findOneAerolineaConfig(id);
  }

  @Post('aerolineas-config')
  @ApiOperation({ summary: 'Crear configuración de aerolínea' })
  createAerolineaConfig(@Body() dto: CreateAerolineaConfigDto) {
    return this.aerolineasService.createAerolineaConfig(dto);
  }

  @Put('aerolineas-config/:id')
  @ApiOperation({ summary: 'Actualizar configuración de aerolínea' })
  updateAerolineaConfig(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAerolineaConfigDto,
  ) {
    return this.aerolineasService.updateAerolineaConfig(id, dto);
  }

  @Delete('aerolineas-config/:id')
  @ApiOperation({ summary: 'Eliminar configuración de aerolínea' })
  removeAerolineaConfig(@Param('id', ParseIntPipe) id: number) {
    return this.aerolineasService.removeAerolineaConfig(id);
  }
}
