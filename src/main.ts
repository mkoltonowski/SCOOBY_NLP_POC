import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter } from '@nestjs/platform-fastify';

async function bootstrap() {
  const adapter = new FastifyAdapter();
  adapter.enableCors({ origin: true, credentials: true });

  const app = await NestFactory.create(AppModule, adapter, {});
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
