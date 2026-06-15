import { Module } from '@nestjs/common';
import { OperacionesService } from './operaciones.service';
import { CalculosService } from './calculos.service';
import { OperacionesController } from './operaciones.controller';

@Module({
  controllers: [OperacionesController],
  providers: [OperacionesService, CalculosService],
  exports: [OperacionesService, CalculosService],
})
export class OperacionesModule {}
