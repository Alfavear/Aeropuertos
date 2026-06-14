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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OperacionesService } from './operaciones.service';

@ApiTags('Operaciones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('operaciones')
export class OperacionesController {
  constructor(private readonly operacionesService: OperacionesService) {}

  @Get('itinerarios')
  @ApiOperation({ summary: 'Listar itinerarios' })
  async findAllItinerarios(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.operacionesService.findAllItinerarios({
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
    });
  }

  @Get('itinerarios/:id')
  @ApiOperation({ summary: 'Obtener itinerario por ID' })
  async findItinerarioById(@Param('id', ParseIntPipe) id: number) {
    return this.operacionesService.findItinerarioById(id);
  }

  @Post('itinerarios')
  @ApiOperation({ summary: 'Crear itinerario' })
  async createItinerario(@Body() data: any) {
    return this.operacionesService.createItinerario(data);
  }

  @Put('itinerarios/:id')
  @ApiOperation({ summary: 'Actualizar itinerario' })
  async updateItinerario(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: any,
  ) {
    return this.operacionesService.updateItinerario(id, data);
  }

  @Delete('itinerarios/:id')
  @ApiOperation({ summary: 'Eliminar itinerario' })
  async deleteItinerario(@Param('id', ParseIntPipe) id: number) {
    return this.operacionesService.deleteItinerario(id);
  }

  @Get('vuelos')
  @ApiOperation({ summary: 'Listar vuelos' })
  async findAllVuelos(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.operacionesService.findAllVuelos({
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
    });
  }

  @Get('vuelos/:id')
  @ApiOperation({ summary: 'Obtener vuelo por ID' })
  async findVueloById(@Param('id', ParseIntPipe) id: number) {
    return this.operacionesService.findVueloById(id);
  }

  @Post('vuelos')
  @ApiOperation({ summary: 'Crear vuelo' })
  async createVuelo(@Body() data: any) {
    return this.operacionesService.createVuelo(data);
  }

  @Put('vuelos/:id')
  @ApiOperation({ summary: 'Actualizar vuelo' })
  async updateVuelo(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: any,
  ) {
    return this.operacionesService.updateVuelo(id, data);
  }

  @Delete('vuelos/:id')
  @ApiOperation({ summary: 'Eliminar vuelo' })
  async deleteVuelo(@Param('id', ParseIntPipe) id: number) {
    return this.operacionesService.deleteVuelo(id);
  }
}
