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
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/jwt.strategy';
import { SeguridadService } from './seguridad.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { CreatePerfilDto } from './dto/create-perfil.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { CreatePermisoPerfilDto } from './dto/create-permiso-perfil.dto';
import { UpdatePermisoPerfilDto } from './dto/update-permiso-perfil.dto';
import { CreateMenuOpcionDto } from './dto/create-menu-opcion.dto';
import { UpdateMenuOpcionDto } from './dto/update-menu-opcion.dto';
import { CreateSesionUsuarioDto } from './dto/create-sesion-usuario.dto';
import { UpdateSesionUsuarioDto } from './dto/update-sesion-usuario.dto';
import { CreateAccesoAeropuertoDto } from './dto/create-acceso-aeropuerto.dto';
import { UpdateAccesoAeropuertoDto } from './dto/update-acceso-aeropuerto.dto';
import { CreateUsuarioCuentaDto } from './dto/create-usuario-cuenta.dto';
import { UpdateUsuarioCuentaDto } from './dto/update-usuario-cuenta.dto';
import { CambiarPasswordDto } from './dto/cambiar-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { BloquearUsuarioDto } from './dto/bloquear-usuario.dto';

@ApiTags('Seguridad')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('seguridad')
export class SeguridadController {
  constructor(private readonly seguridadService: SeguridadService) {}

  // ============================================================
  // USUARIOS
  // ============================================================

  @Get('usuarios')
  @ApiOperation({ summary: 'Listar usuarios' })
  @ApiQuery({ name: 'activo', required: false, type: String })
  @ApiQuery({ name: 'idPerfil', required: false, type: String })
  findAllUsuarios(
    @Query('activo') activo?: string,
    @Query('idPerfil') idPerfil?: string,
  ) {
    return this.seguridadService.findAllUsuarios({ activo, idPerfil });
  }

  @Get('usuarios/:id')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  findUsuarioById(@Param('id', ParseIntPipe) id: number) {
    return this.seguridadService.findUsuarioById(id);
  }

  @Post('usuarios')
  @ApiOperation({ summary: 'Crear usuario' })
  createUsuario(@Body() dto: CreateUsuarioDto) {
    return this.seguridadService.createUsuario(dto);
  }

  @Put('usuarios/:id')
  @ApiOperation({ summary: 'Actualizar usuario' })
  updateUsuario(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUsuarioDto,
  ) {
    return this.seguridadService.updateUsuario(id, dto);
  }

  @Delete('usuarios/:id')
  @ApiOperation({ summary: 'Eliminar usuario (desactivación lógica)' })
  removeUsuario(@Param('id', ParseIntPipe) id: number) {
    return this.seguridadService.removeUsuario(id);
  }

  // ============================================================
  // CAMBIO / RESETEO DE CONTRASEÑA
  // ============================================================

  @Post('usuarios/:id/cambiar-password')
  @ApiOperation({ summary: 'Cambiar contraseña (con verificación de actual)' })
  cambiarPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CambiarPasswordDto,
  ) {
    return this.seguridadService.cambiarPassword(id, dto);
  }

  @Post('usuarios/:id/reset-password')
  @ApiOperation({ summary: 'Resetear contraseña (admin, fuerza cambio en próximo login)' })
  resetPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ResetPasswordDto,
  ) {
    return this.seguridadService.resetPassword(id, dto);
  }

  // ============================================================
  // BLOQUEO
  // ============================================================

  @Post('usuarios/:id/bloquear')
  @ApiOperation({ summary: 'Bloquear usuario (programado/movimiento/severo)' })
  bloquearUsuario(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: BloquearUsuarioDto,
  ) {
    return this.seguridadService.bloquearUsuario(id, dto);
  }

  @Post('usuarios/:id/desbloquear')
  @ApiOperation({ summary: 'Desbloquear usuario completamente' })
  desbloquearUsuario(@Param('id', ParseIntPipe) id: number) {
    return this.seguridadService.desbloquearUsuario(id);
  }

  @Get('usuarios/:id/validar-bloqueo')
  @ApiOperation({ summary: 'Validar estado de bloqueo del usuario' })
  validarBloqueo(@Param('id', ParseIntPipe) id: number) {
    return this.seguridadService.validarBloqueo(id);
  }

  // ============================================================
  // PERFILES
  // ============================================================

  @Get('perfiles')
  @ApiOperation({ summary: 'Listar perfiles' })
  @ApiQuery({ name: 'activo', required: false, type: String })
  findAllPerfiles(@Query('activo') activo?: string) {
    return this.seguridadService.findAllPerfiles({ activo });
  }

  @Get('perfiles/:id')
  @ApiOperation({ summary: 'Obtener perfil por ID' })
  findPerfilById(@Param('id', ParseIntPipe) id: number) {
    return this.seguridadService.findPerfilById(id);
  }

  @Post('perfiles')
  @ApiOperation({ summary: 'Crear perfil' })
  createPerfil(@Body() dto: CreatePerfilDto) {
    return this.seguridadService.createPerfil(dto);
  }

  @Put('perfiles/:id')
  @ApiOperation({ summary: 'Actualizar perfil' })
  updatePerfil(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePerfilDto,
  ) {
    return this.seguridadService.updatePerfil(id, dto);
  }

  @Delete('perfiles/:id')
  @ApiOperation({ summary: 'Eliminar perfil' })
  removePerfil(@Param('id', ParseIntPipe) id: number) {
    return this.seguridadService.removePerfil(id);
  }

  // ============================================================
  // ASIGNACIÓN DE MENÚS A PERFILES
  // ============================================================

  @Post('perfiles/:id/menus')
  @ApiOperation({ summary: 'Asignar menús a un perfil' })
  asignarMenusAPerfil(
    @Param('id', ParseIntPipe) id: number,
    @Body() idsMenus: number[],
  ) {
    return this.seguridadService.asignarMenusAPerfil(id, idsMenus);
  }

  @Get('perfiles/:id/menus')
  @ApiOperation({ summary: 'Obtener árbol de menús con permisos del perfil' })
  obtenerMenuPorPerfil(@Param('id', ParseIntPipe) id: number) {
    return this.seguridadService.obtenerMenuPorPerfil(id);
  }

  // ============================================================
  // PERMISOS PERFIL
  // ============================================================

  @Get('permisos-perfil')
  @ApiOperation({ summary: 'Listar permisos de perfil' })
  @ApiQuery({ name: 'idPerfil', required: false, type: String })
  findAllPermisosPerfil(@Query('idPerfil') idPerfil?: string) {
    return this.seguridadService.findAllPermisosPerfil({ idPerfil });
  }

  @Get('permisos-perfil/:id')
  @ApiOperation({ summary: 'Obtener permiso de perfil por ID' })
  findPermisoPerfilById(@Param('id', ParseIntPipe) id: number) {
    return this.seguridadService.findPermisoPerfilById(id);
  }

  @Post('permisos-perfil')
  @ApiOperation({ summary: 'Crear permiso de perfil' })
  createPermisoPerfil(@Body() dto: CreatePermisoPerfilDto) {
    return this.seguridadService.createPermisoPerfil(dto);
  }

  @Put('permisos-perfil/:id')
  @ApiOperation({ summary: 'Actualizar permiso de perfil' })
  updatePermisoPerfil(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePermisoPerfilDto,
  ) {
    return this.seguridadService.updatePermisoPerfil(id, dto);
  }

  @Delete('permisos-perfil/:id')
  @ApiOperation({ summary: 'Eliminar permiso de perfil' })
  removePermisoPerfil(@Param('id', ParseIntPipe) id: number) {
    return this.seguridadService.removePermisoPerfil(id);
  }

  // ============================================================
  // MENU OPCIONES
  // ============================================================

  @Get('menu-opciones')
  @ApiOperation({ summary: 'Listar opciones de menú' })
  @ApiQuery({ name: 'idPadre', required: false, type: String })
  findAllMenuOpciones(@Query('idPadre') idPadre?: string) {
    return this.seguridadService.findAllMenuOpciones({ idPadre });
  }

  @Get('menu-opciones/:id')
  @ApiOperation({ summary: 'Obtener opción de menú por ID' })
  findMenuOpcionById(@Param('id', ParseIntPipe) id: number) {
    return this.seguridadService.findMenuOpcionById(id);
  }

  @Post('menu-opciones')
  @ApiOperation({ summary: 'Crear opción de menú' })
  createMenuOpcion(@Body() dto: CreateMenuOpcionDto) {
    return this.seguridadService.createMenuOpcion(dto);
  }

  @Put('menu-opciones/:id')
  @ApiOperation({ summary: 'Actualizar opción de menú' })
  updateMenuOpcion(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMenuOpcionDto,
  ) {
    return this.seguridadService.updateMenuOpcion(id, dto);
  }

  @Delete('menu-opciones/:id')
  @ApiOperation({ summary: 'Eliminar opción de menú (desactivación lógica)' })
  removeMenuOpcion(@Param('id', ParseIntPipe) id: number) {
    return this.seguridadService.removeMenuOpcion(id);
  }

  // ============================================================
  // SESIONES USUARIO
  // ============================================================

  @Get('sesiones-usuario')
  @ApiOperation({ summary: 'Listar sesiones de usuario' })
  @ApiQuery({ name: 'idUsuario', required: false, type: String })
  @ApiQuery({ name: 'idAeropuerto', required: false, type: String })
  findAllSesionesUsuario(
    @Query('idUsuario') idUsuario?: string,
    @Query('idAeropuerto') idAeropuerto?: string,
  ) {
    return this.seguridadService.findAllSesionesUsuario({ idUsuario, idAeropuerto });
  }

  @Get('sesiones-usuario/:id')
  @ApiOperation({ summary: 'Obtener sesión de usuario por ID' })
  findSesionUsuarioById(@Param('id', ParseIntPipe) id: number) {
    return this.seguridadService.findSesionUsuarioById(id);
  }

  @Post('sesiones-usuario')
  @ApiOperation({ summary: 'Crear sesión de usuario' })
  createSesionUsuario(@Body() dto: CreateSesionUsuarioDto) {
    return this.seguridadService.createSesionUsuario(dto);
  }

  @Put('sesiones-usuario/:id')
  @ApiOperation({ summary: 'Actualizar sesión de usuario' })
  updateSesionUsuario(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSesionUsuarioDto,
  ) {
    return this.seguridadService.updateSesionUsuario(id, dto);
  }

  @Delete('sesiones-usuario/:id')
  @ApiOperation({ summary: 'Eliminar sesión de usuario' })
  removeSesionUsuario(@Param('id', ParseIntPipe) id: number) {
    return this.seguridadService.removeSesionUsuario(id);
  }

  // ============================================================
  // MIS AEROPUERTOS (usuario autenticado)
  // ============================================================

  @Get('mis-aeropuertos')
  @ApiOperation({ summary: 'Obtener aeropuertos a los que tengo acceso' })
  findMisAeropuertos(@CurrentUser() user: AuthUser) {
    return this.seguridadService.findMisAeropuertos(user.id);
  }

  @Get('mis-aeropuertos/:idAeropuerto')
  @ApiOperation({ summary: 'Obtener detalle de acceso a un aeropuerto específico' })
  findAccesoAeropuertoByUserAndAirport(
    @CurrentUser() user: AuthUser,
    @Param('idAeropuerto', ParseIntPipe) idAeropuerto: number,
  ) {
    return this.seguridadService.findAccesoAeropuertoByUserAndAirport(user.id, idAeropuerto);
  }

  // ============================================================
  // ACCESOS AEROPUERTO (admin)
  // ============================================================

  @Get('accesos-aeropuerto')
  @ApiOperation({ summary: 'Listar accesos a aeropuerto' })
  @ApiQuery({ name: 'idUsuario', required: false, type: String })
  @ApiQuery({ name: 'idAeropuerto', required: false, type: String })
  @ApiQuery({ name: 'activo', required: false, type: String })
  findAllAccesosAeropuerto(
    @Query('idUsuario') idUsuario?: string,
    @Query('idAeropuerto') idAeropuerto?: string,
    @Query('activo') activo?: string,
  ) {
    return this.seguridadService.findAllAccesosAeropuerto({ idUsuario, idAeropuerto, activo });
  }

  @Get('accesos-aeropuerto/:id')
  @ApiOperation({ summary: 'Obtener acceso a aeropuerto por ID' })
  findAccesoAeropuertoById(@Param('id', ParseIntPipe) id: number) {
    return this.seguridadService.findAccesoAeropuertoById(id);
  }

  @Post('accesos-aeropuerto')
  @ApiOperation({ summary: 'Crear acceso a aeropuerto' })
  createAccesoAeropuerto(@Body() dto: CreateAccesoAeropuertoDto) {
    return this.seguridadService.createAccesoAeropuerto(dto);
  }

  @Put('accesos-aeropuerto/:id')
  @ApiOperation({ summary: 'Actualizar acceso a aeropuerto' })
  updateAccesoAeropuerto(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAccesoAeropuertoDto,
  ) {
    return this.seguridadService.updateAccesoAeropuerto(id, dto);
  }

  @Delete('accesos-aeropuerto/:id')
  @ApiOperation({ summary: 'Eliminar acceso a aeropuerto' })
  removeAccesoAeropuerto(@Param('id', ParseIntPipe) id: number) {
    return this.seguridadService.removeAccesoAeropuerto(id);
  }

  // ============================================================
  // USUARIOS CUENTAS
  // ============================================================

  @Get('usuarios-cuentas')
  @ApiOperation({ summary: 'Listar cuentas de usuario' })
  @ApiQuery({ name: 'idUsuario', required: false, type: String })
  findAllUsuariosCuentas(@Query('idUsuario') idUsuario?: string) {
    return this.seguridadService.findAllUsuariosCuentas({ idUsuario });
  }

  @Get('usuarios-cuentas/:id')
  @ApiOperation({ summary: 'Obtener cuenta de usuario por ID' })
  findUsuarioCuentaById(@Param('id', ParseIntPipe) id: number) {
    return this.seguridadService.findUsuarioCuentaById(id);
  }

  @Post('usuarios-cuentas')
  @ApiOperation({ summary: 'Crear cuenta de usuario' })
  createUsuarioCuenta(@Body() dto: CreateUsuarioCuentaDto) {
    return this.seguridadService.createUsuarioCuenta(dto);
  }

  @Put('usuarios-cuentas/:id')
  @ApiOperation({ summary: 'Actualizar cuenta de usuario' })
  updateUsuarioCuenta(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUsuarioCuentaDto,
  ) {
    return this.seguridadService.updateUsuarioCuenta(id, dto);
  }

  @Delete('usuarios-cuentas/:id')
  @ApiOperation({ summary: 'Eliminar cuenta de usuario' })
  removeUsuarioCuenta(@Param('id', ParseIntPipe) id: number) {
    return this.seguridadService.removeUsuarioCuenta(id);
  }
}
