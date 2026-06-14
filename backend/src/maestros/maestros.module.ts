import { Module } from '@nestjs/common';
import { MaestrosService } from './maestros.service';
import { MaestrosController } from './maestros.controller';

@Module({
  controllers: [MaestrosController],
  providers: [MaestrosService],
  exports: [MaestrosService],
})
export class MaestrosModule {}
