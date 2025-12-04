import '@app/shared-lib/tracing';
import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);
  app.useLogger(app.get(Logger));

  await app.listen(3002);
  console.log('🔐 Auth Service is listening on port 3002');
}
bootstrap();