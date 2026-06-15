import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';

@Injectable()
export class AeropuertoActivoGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as { idAeropuertoActivo?: number } | undefined;
    const headerAeropuerto = request.headers['x-aeropuerto-activo'];

    if (!user) {
      throw new BadRequestException('Usuario no autenticado');
    }

    if (headerAeropuerto) {
      const headerId = parseInt(headerAeropuerto, 10);
      if (isNaN(headerId) || (user.idAeropuertoActivo && user.idAeropuertoActivo !== headerId)) {
        throw new BadRequestException(
          'El aeropuerto activo en el encabezado no coincide con el de la sesión',
        );
      }
      (request as Record<string, unknown>).aeropuertoActivoId = headerId;
      return true;
    }

    if (!user.idAeropuertoActivo) {
      throw new BadRequestException('No hay un aeropuerto activo seleccionado');
    }

    (request as Record<string, unknown>).aeropuertoActivoId = user.idAeropuertoActivo;
    return true;
  }
}
