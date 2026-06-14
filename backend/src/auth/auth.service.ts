import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.prisma.usuario.findUnique({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.activo) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    if (user.bloqueado) {
      throw new UnauthorizedException('Usuario bloqueado');
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      await this.prisma.usuario.update({
        where: { id: user.id },
        data: { intentosFallidos: (user.intentosFallidos ?? 0) + 1 },
      });
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if ((user.intentosFallidos ?? 0) > 0) {
      await this.prisma.usuario.update({
        where: { id: user.id },
        data: { intentosFallidos: 0, ultimoAcceso: new Date() },
      });
    } else {
      await this.prisma.usuario.update({
        where: { id: user.id },
        data: { ultimoAcceso: new Date() },
      });
    }

    const payload = { sub: user.id, username: user.username };

    return {
      token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        nombre: user.nombre,
        email: user.email,
        rol: user.idPerfil ? 'user' : 'admin',
      },
    };
  }
}
