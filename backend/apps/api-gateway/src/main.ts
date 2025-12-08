import '@app/shared-lib/tracing';
import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { Logger } from 'nestjs-pino';
import { GlobalExceptionFilter } from '@app/shared-lib/logging/global-exception.filter';
import { ClsService } from 'nestjs-cls';
import { UserContextInterceptor } from '@app/shared-lib';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  const logger = app.get(Logger);
  app.useLogger(logger);

  app.useGlobalFilters(new GlobalExceptionFilter(logger));

  const clsService = app.get(ClsService);
  app.useGlobalInterceptors(new UserContextInterceptor(clsService));

  await app.listen(3001);

  console.log(`🚀 API Gateway is running on: http://localhost:3001`);
}
bootstrap();
