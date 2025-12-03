import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { Logger } from 'nestjs-pino';
import { GlobalExceptionFilter } from '@app/shared-lib/logging/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  await app.listen(3001);

  app.useLogger(app.get(Logger));
  app.useGlobalFilters(new GlobalExceptionFilter(app.get(Logger)));

  console.log(`🚀 API Gateway is running on: http://localhost:3001`);
}
bootstrap();