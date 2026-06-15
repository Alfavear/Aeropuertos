import { Global, Module } from '@nestjs/common';
import { SecuenciaService } from './secuencia.service';

@Global()
@Module({
  providers: [SecuenciaService],
  exports: [SecuenciaService],
})
export class SecuenciaModule {}
