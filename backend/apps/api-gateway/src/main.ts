import '@app/shared-lib/tracing';
import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { Logger } from 'nestjs-pino';
import { GlobalExceptionFilter } from '@app/shared-lib/logging/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  const logger = app.get(Logger);
  app.useLogger(logger);

  app.useGlobalFilters(new GlobalExceptionFilter(logger));

  await app.listen(3001);

  console.log(`🚀 API Gateway is running on: http://localhost:3001`);
}
bootstrap();
