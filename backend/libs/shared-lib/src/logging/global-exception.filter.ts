import { Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException 
      ? exception.getStatus() 
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = exception instanceof HttpException
      ? exception.getResponse()
      : { message: (exception as any).message || 'Internal server error' };

    // 1. Log ลง Console/File (เพื่อให้ Promtail อ่านไป Grafana)
    this.logger.error({
      msg: 'Request Failed',
      status,
      error: errorResponse,
      path: request.url,
      method: request.method,
      stack: (exception as any).stack, // เก็บ Stack Trace ไว้แก้บั๊ก
    });

    // 2. ส่ง Response กลับไปหา User (อันนี้คือส่วนที่ขาดไป)
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: errorResponse,
    });
  }
}