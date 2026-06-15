import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { OperacionesModule } from './operaciones/operaciones.module';
import { FacturacionModule } from './facturacion/facturacion.module';
import { SeguridadModule } from './seguridad/seguridad.module';
import { OrganizacionModule } from './organizacion/organizacion.module';
import { AerolineasModule } from './aerolineas/aerolineas.module';
import { TarifasModule } from './tarifas/tarifas.module';
import { ReportesModule } from './reportes/reportes.module';
import { ConfiguracionModule } from './configuracion/configuracion.module';
import { PeriodosModule } from './periodos/periodos.module';
import { LiquidacionesModule } from './liquidaciones/liquidaciones.module';
import { SecuenciaModule } from './secuencia/secuencia.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    OperacionesModule,
    FacturacionModule,
    SeguridadModule,
    OrganizacionModule,
    AerolineasModule,
    TarifasModule,
    ReportesModule,
    ConfiguracionModule,
    PeriodosModule,
    LiquidacionesModule,
    SecuenciaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
