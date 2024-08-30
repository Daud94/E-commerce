import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionsFilter } from './middlewares/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(helmet.xssFilter());

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:4000',
      'http://localhost:5173',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Date', 'Content-Type', 'Origin', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 200,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix(process.env['PREFIX']);

  const config = new DocumentBuilder()
    .setTitle('E-commerce API Documentation')
    .setDescription('E-commerce API Documentation')
    .setVersion('v1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableVersioning({
    type: VersioningType.URI,
  });
  const adapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(adapterHost));
  const PORT = parseInt(process.env['PORT']) || 4000;
  await app.listen(PORT);
}
bootstrap();
