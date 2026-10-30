import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service.js';

@Controller('api/v1')
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'flowarm-api',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health/database')
  async getDatabaseHealth() {
    await this.prisma.$queryRaw`SELECT 1`;

    return {
      status: 'ok',
      service: 'flowarm-database',
      database: 'connected',
      timestamp: new Date().toISOString(),
    };
  }
}