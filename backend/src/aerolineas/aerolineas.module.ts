import { Module } from '@nestjs/common';
import { AerolineasController } from './aerolineas.controller';
import { AerolineasService } from './aerolineas.service';

@Module({
  controllers: [AerolineasController],
  providers: [AerolineasService],
  exports: [AerolineasService],
})
export class AerolineasModule {}
