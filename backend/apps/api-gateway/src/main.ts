import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';

async function bootstrap() {
  // สร้างแอปพลิเคชันแบบ HTTP (ไม่ใช่ createMicroservice)
  const app = await NestFactory.create(ApiGatewayModule);

  // สั่งให้รันที่ Port 3000 (หรือ Port อื่นที่ไม่ชนกับ Microservice)
  await app.listen(3000);

  console.log(`🚀 API Gateway is running on: http://localhost:3000`);
}
bootstrap();