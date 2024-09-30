import { 
	ExceptionFilter, 
	Catch, 
	ArgumentsHost, 
	HttpException, 
	HttpStatus, 
	Injectable
} from '@nestjs/common';
import { 
	Request, 
	Response 
} from 'express';
import { LoggerService } from '../logger/logger.service';
import { ModuleRef } from '@nestjs/core';

@Catch()
@Injectable()
export class AllExceptionsFilter implements ExceptionFilter {
	constructor(private readonly logger: LoggerService) {}

	catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException
      ? (exception.getResponse() as any).message || exception.message
      : 'Internal server error';
		
		this.logger.error(`Exception has been received ${message}`, '', 'AuthService');

    response.status(status).json({
      status_code: status,
      message: HttpStatus[status],
      errors: [message],
      data: {}
    });
  }
}