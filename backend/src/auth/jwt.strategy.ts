import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'aerogest-secret-key-dev',
    });
  }

  async validate(payload: { sub: number; username: string }) {
    const user = await this.prisma.usuario.findUnique({
      where: { id: payload.sub },
      select: { id: true, username: true, nombre: true, email: true, activo: true },
    });

    if (!user || !user.activo) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
