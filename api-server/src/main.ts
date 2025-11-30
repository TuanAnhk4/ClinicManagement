import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import { AllExceptionsFilter } from '@common/filters';

import { LoggingInterceptor } from '@common/interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // call api

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  //logging
  app.useGlobalInterceptors(new LoggingInterceptor());

  //filter
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
