import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { SeleccionarAeropuertoDto } from './dto/seleccionar-aeropuerto.dto';
import type { AuthUser } from './jwt.strategy';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.username, dto.password);
  }

  @Post('seleccionar-aeropuerto')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Seleccionar aeropuerto activo para la sesión' })
  async seleccionarAeropuerto(
    @CurrentUser() user: AuthUser,
    @Body() dto: SeleccionarAeropuertoDto,
  ) {
    return this.authService.seleccionarAeropuerto(user.id, dto.idAeropuerto);
  }
}
