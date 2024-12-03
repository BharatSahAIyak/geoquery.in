import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as multipart from 'fastify-multipart';
import { ResponseFormatInterceptor } from '@samagra-x/stencil';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Example of setting up a logger
  const logger = new Logger('Main'); // 'Main' is the context name

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  const host = configService.get<string>('host');

  // Register plugins and middleware
  await app.register(multipart);

  // Global setup
  app.useGlobalInterceptors(new ResponseFormatInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  // Swagger API documentation setup
  const options = new DocumentBuilder()
    .setTitle('GeoQuery.In')
    .setDescription('Demo')
    .setVersion('1.0')
    .addServer('http://localhost:3000/', 'Local environment')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  // Start the server
  await app.listen(port, host, (err, address) => {
    logger.log(`Server running on ${host}:${port}`);
  });

  // Log additional information as needed
  logger.log('Application started');
}

bootstrap();
