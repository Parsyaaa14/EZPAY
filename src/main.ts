import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { CorrelationIdMiddleware } from './utils/correlation-id.middleware';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const logger = app.get(Logger);

  app.disable('x-powered-by');
  app.use(CorrelationIdMiddleware());
  app.useLogger(logger);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // Konfigurasi folder publik
  app.useStaticAssets(join(__dirname, '..', 'public'));

  const config = new DocumentBuilder()
    .setTitle('API Docs')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('apidocs')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get<number>('port');

  const hostname = '0.0.0.0';

  await app.listen(port, hostname, () => {
    logger.log(`Server listening on ${hostname}:${port}`);
  });
}


bootstrap();

