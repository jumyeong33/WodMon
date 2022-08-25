import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { AppModule } from './app.module';
import authorize from './utils/preventRobots';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        return new BadRequestException({
          ok: false,
          data: 'ValidationError',
          message: errors[0].constraints,
        });
      },
    }),
  );
  app.use('/', authorize);
  await app.listen(3000);
}
bootstrap();
