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
import { ReportesService } from './reportes.service';
import { CreateReporteDto } from './dto/create-reporte.dto';
import { UpdateReporteDto } from './dto/update-reporte.dto';
import { CreateCategoriaReporteDto } from './dto/create-categoria-reporte.dto';
import { UpdateCategoriaReporteDto } from './dto/update-categoria-reporte.dto';

@ApiTags('Reportes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar reportes' })
  @ApiQuery({ name: 'idCategoria', required: false, type: Number })
  findAll(@Query('idCategoria') idCategoria?: string) {
    return this.reportesService.findAllReportes({
      idCategoria: idCategoria ? parseInt(idCategoria, 10) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener reporte por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reportesService.findOneReporte(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear reporte' })
  create(@Body() dto: CreateReporteDto) {
    return this.reportesService.createReporte(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar reporte' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateReporteDto) {
    return this.reportesService.updateReporte(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar reporte' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reportesService.removeReporte(id);
  }

  @Get('categorias-reporte')
  @ApiOperation({ summary: 'Listar categorías de reporte' })
  findAllCategorias() {
    return this.reportesService.findAllCategorias();
  }

  @Get('categorias-reporte/:id')
  @ApiOperation({ summary: 'Obtener categoría de reporte por ID' })
  findOneCategoria(@Param('id', ParseIntPipe) id: number) {
    return this.reportesService.findOneCategoria(id);
  }

  @Post('categorias-reporte')
  @ApiOperation({ summary: 'Crear categoría de reporte' })
  createCategoria(@Body() dto: CreateCategoriaReporteDto) {
    return this.reportesService.createCategoria(dto);
  }

  @Put('categorias-reporte/:id')
  @ApiOperation({ summary: 'Actualizar categoría de reporte' })
  updateCategoria(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoriaReporteDto,
  ) {
    return this.reportesService.updateCategoria(id, dto);
  }

  @Delete('categorias-reporte/:id')
  @ApiOperation({ summary: 'Eliminar categoría de reporte' })
  removeCategoria(@Param('id', ParseIntPipe) id: number) {
    return this.reportesService.removeCategoria(id);
  }
}
