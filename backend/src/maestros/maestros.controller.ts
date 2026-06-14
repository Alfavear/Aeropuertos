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
import { MaestrosService } from './maestros.service';

@ApiTags('Maestros')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('maestros')
export class MaestrosController {
  constructor(private readonly maestrosService: MaestrosService) {}

  @Get(':modelo')
  @ApiOperation({ summary: 'Listar todos los registros de un maestro' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  async findAll(
    @Param('modelo') modelo: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.maestrosService.findAll(modelo, {
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
    });
  }

  @Get(':modelo/:id')
  @ApiOperation({ summary: 'Obtener un registro por ID' })
  async findOne(@Param('modelo') modelo: string, @Param('id', ParseIntPipe) id: number) {
    return this.maestrosService.findOne(modelo, id);
  }

  @Post(':modelo')
  @ApiOperation({ summary: 'Crear un nuevo registro' })
  async create(@Param('modelo') modelo: string, @Body() data: Record<string, any>) {
    return this.maestrosService.create(modelo, data);
  }

  @Put(':modelo/:id')
  @ApiOperation({ summary: 'Actualizar un registro existente' })
  async update(
    @Param('modelo') modelo: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Record<string, any>,
  ) {
    return this.maestrosService.update(modelo, id, data);
  }

  @Delete(':modelo/:id')
  @ApiOperation({ summary: 'Eliminar un registro' })
  async remove(@Param('modelo') modelo: string, @Param('id', ParseIntPipe) id: number) {
    return this.maestrosService.remove(modelo, id);
  }
}
