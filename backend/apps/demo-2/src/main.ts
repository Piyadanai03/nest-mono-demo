import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Demo2Module } from './demo-2.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    Demo2Module,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3001, // Port ต้องไม่ซ้ำกับ Gateway
      },
    },
  );
  await app.listen();
  console.log('🚀 Demo-2 Microservice is listening on port 3001');
}
bootstrap();