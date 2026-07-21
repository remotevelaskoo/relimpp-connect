import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );
  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN?.split(',') ?? true,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Relimpp Connect API')
    .setDescription('API do Core Platform (MVP 0)')
    .setVersion('0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Relimpp Connect API em http://localhost:${port}/api/v1`);
}

bootstrap();
