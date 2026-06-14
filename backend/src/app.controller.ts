import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class AppController {
  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  health() {
    return {
      status: 'ok',
      version: '1.0.0',
    };
  }
}
