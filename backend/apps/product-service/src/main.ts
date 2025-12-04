import '@app/shared-lib/tracing';
import { NestFactory } from '@nestjs/core';
import { ProductServiceModule } from './product-service.module';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(ProductServiceModule);

  app.useLogger(app.get(Logger));
  
  await app.listen(3003);
  console.log('📦 Product Service is listening on HTTP port 3003');
}
bootstrap();
