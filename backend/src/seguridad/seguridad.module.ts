import { Module } from '@nestjs/common';
import { SeguridadService } from './seguridad.service';
import { SeguridadController } from './seguridad.controller';

@Module({
  controllers: [SeguridadController],
  providers: [SeguridadService],
  exports: [SeguridadService],
})
export class SeguridadModule {}
