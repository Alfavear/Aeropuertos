import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

export interface JwtPayload {
  sub: number;
  username: string;
  idAeropuertoActivo?: number;
}

export interface AuthUser {
  id: number;
  username: string;
  nombre: string | null;
  email: string | null;
  idAeropuertoActivo?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthUser> {
    const user = await this.prisma.usuario.findUnique({
      where: { id: payload.sub },
      select: { id: true, username: true, nombre: true, email: true, activo: true },
    });

    if (!user || !user.activo) {
      throw new UnauthorizedException();
    }

    return {
      id: user.id,
      username: user.username,
      nombre: user.nombre,
      email: user.email,
      idAeropuertoActivo: payload.idAeropuertoActivo,
    };
  }
}
