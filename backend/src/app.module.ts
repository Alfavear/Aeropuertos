import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MaestrosModule } from './maestros/maestros.module';
import { OperacionesModule } from './operaciones/operaciones.module';
import { FacturacionModule } from './facturacion/facturacion.module';
import { SeguridadModule } from './seguridad/seguridad.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    MaestrosModule,
    OperacionesModule,
    FacturacionModule,
    SeguridadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
