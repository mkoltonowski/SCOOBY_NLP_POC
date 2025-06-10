import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const adapter = new FastifyAdapter();
  adapter.enableCors({ origin: true, credentials: true });
  const app = await NestFactory.create(AppModule, adapter, {});

  const config = new DocumentBuilder()
    .setTitle('Neuro Dog')
    .setDescription('The Neuro Dog API description')
    .setVersion('1.0')
    .addTag('Shows')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
