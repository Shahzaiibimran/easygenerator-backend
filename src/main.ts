import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { 
  ValidationPipe, 
  BadRequestException, 
  HttpStatus,
  Logger
} from '@nestjs/common';
import { AllExceptionsFilter } from './utils/exception.util';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('ValidationPipe');

  app.enableCors({
    origin: '*'
  });
  
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors) => {
      const pipelineErrors = errors.map(error => ({
        [error.property]: Object.values(error.constraints),
      }));

      logger.warn(`${JSON.stringify(pipelineErrors)}`, 'AuthService');

      return new BadRequestException({
        status_code: HttpStatus.BAD_REQUEST,
        message: HttpStatus[HttpStatus.BAD_REQUEST],
        errors: pipelineErrors,
        data: {}
      });
    },
  }));

  const exceptionLogger = app.get(LoggerService);

  app.useGlobalFilters(new AllExceptionsFilter(exceptionLogger));

  await app.listen(process.env.APP_PORT);
}
bootstrap();
