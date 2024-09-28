import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException, HttpStatus } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*'
  });
  
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors) => {
      return new BadRequestException({
        status_code: HttpStatus.BAD_REQUEST,
        message: HttpStatus[HttpStatus.BAD_REQUEST],
        errors: errors.map(error => ({
          [error.property]: Object.values(error.constraints),
        })),
        data: {}
      });
    },
  }));

  await app.listen(process.env.APP_PORT);
}
bootstrap();
