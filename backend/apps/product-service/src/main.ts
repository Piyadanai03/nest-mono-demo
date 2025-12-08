import '@app/shared-lib/tracing';
import { NestFactory } from '@nestjs/core';
import { ProductServiceModule } from './product-service.module';
import { Logger } from 'nestjs-pino';
import { ClsService } from 'nestjs-cls';
import { UserContextInterceptor } from '@app/shared-lib';

async function bootstrap() {
  const app = await NestFactory.create(ProductServiceModule);

  app.useLogger(app.get(Logger));

  const clsService = app.get(ClsService);
  app.useGlobalInterceptors(new UserContextInterceptor(clsService));
  
  await app.listen(3003);
  console.log('📦 Product Service is listening on HTTP port 3003');
}
bootstrap();
