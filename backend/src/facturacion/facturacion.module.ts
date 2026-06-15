import { Module } from '@nestjs/common';
import { FacturacionController } from './facturacion.controller';
import { FacturacionService } from './facturacion.service';
import { FacturacionEngineService } from './facturacion-engine.service';

@Module({
  controllers: [FacturacionController],
  providers: [FacturacionService, FacturacionEngineService],
  exports: [FacturacionService, FacturacionEngineService],
})
export class FacturacionModule {}
