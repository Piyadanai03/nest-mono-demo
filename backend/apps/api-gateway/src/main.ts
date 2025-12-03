import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { Logger } from 'nestjs-pino';
import { GlobalExceptionFilter } from '@app/shared-lib/logging/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  app.useLogger(app.get(Logger));
  app.useGlobalFilters(new GlobalExceptionFilter(app.get(Logger)));

  await app.listen(3001);

  console.log(`🚀 API Gateway is running on: http://localhost:3001`);
}
bootstrap();
