import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed/seed.module';
import { SeedService } from './seed/seed.service';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedService = app.get(SeedService);
  const logger = new Logger('SeedRunner');

  try {
    await seedService.runSeed();
  } catch (error) {
    logger.error('Seed process failed', error);
  } finally {
    await app.close();
  }
}

bootstrap();
