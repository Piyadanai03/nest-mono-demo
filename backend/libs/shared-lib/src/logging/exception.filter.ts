import { Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorDetails = {
      message: (exception as any).message || 'Internal server error',
      status: status,
      stack: (exception as any).stack,
      context: exception instanceof HttpException ? exception.getResponse() : {}, 
    };

    this.logger.error(errorDetails, 'An unhandled exception occurred');
  }
}