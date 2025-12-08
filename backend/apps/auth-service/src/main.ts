import '@app/shared-lib/tracing';
import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import { Logger } from 'nestjs-pino';
import { ClsService } from 'nestjs-cls';
import { UserContextInterceptor } from '@app/shared-lib';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);
  app.useLogger(app.get(Logger));

  const clsService = app.get(ClsService);
  app.useGlobalInterceptors(new UserContextInterceptor(clsService));

  await app.listen(3002);
  console.log('🔐 Auth Service is listening on port 3002');
}
bootstrap();