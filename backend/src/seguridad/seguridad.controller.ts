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
import { SeguridadService } from './seguridad.service';

@ApiTags('Seguridad')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('seguridad')
export class SeguridadController {
  constructor(private readonly seguridadService: SeguridadService) {}

  @Get('usuarios')
  @ApiOperation({ summary: 'Listar usuarios' })
  async findAllUsuarios(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.seguridadService.findAllUsuarios({
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
    });
  }

  @Get('usuarios/:id')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  async findUsuarioById(@Param('id', ParseIntPipe) id: number) {
    return this.seguridadService.findUsuarioById(id);
  }

  @Post('usuarios')
  @ApiOperation({ summary: 'Crear usuario' })
  async createUsuario(@Body() data: { username: string; password: string; nombre?: string; email?: string }) {
    return this.seguridadService.createUsuario(data);
  }

  @Put('usuarios/:id')
  @ApiOperation({ summary: 'Actualizar usuario' })
  async updateUsuario(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: { nombre?: string; email?: string; activo?: boolean; bloqueado?: boolean; password?: string },
  ) {
    return this.seguridadService.updateUsuario(id, data);
  }

  @Delete('usuarios/:id')
  @ApiOperation({ summary: 'Eliminar usuario' })
  async deleteUsuario(@Param('id', ParseIntPipe) id: number) {
    return this.seguridadService.deleteUsuario(id);
  }

  @Get('perfiles')
  @ApiOperation({ summary: 'Listar perfiles' })
  async findAllPerfiles() {
    return this.seguridadService.findAllPerfiles();
  }

  @Get('perfiles/:id')
  @ApiOperation({ summary: 'Obtener perfil por ID' })
  async findPerfilById(@Param('id', ParseIntPipe) id: number) {
    return this.seguridadService.findPerfilById(id);
  }

  @Post('perfiles')
  @ApiOperation({ summary: 'Crear perfil' })
  async createPerfil(@Body() data: { codigo: string; nombre: string; descripcion?: string }) {
    return this.seguridadService.createPerfil(data);
  }

  @Put('perfiles/:id')
  @ApiOperation({ summary: 'Actualizar perfil' })
  async updatePerfil(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: { codigo?: string; nombre?: string; descripcion?: string; activo?: boolean },
  ) {
    return this.seguridadService.updatePerfil(id, data);
  }

  @Delete('perfiles/:id')
  @ApiOperation({ summary: 'Eliminar perfil' })
  async deletePerfil(@Param('id', ParseIntPipe) id: number) {
    return this.seguridadService.deletePerfil(id);
  }

  @Get('menu')
  @ApiOperation({ summary: 'Obtener opciones de menú' })
  async findMenuOpciones() {
    return this.seguridadService.findMenuOpciones();
  }
}
