import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DEMO_2_SERVICE', // Token ชื่อนี้ต้องตรงกับที่ Inject ใน Service/Controller
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3001 }, // ต้องตรงกับ Demo-2
      },
    ]),
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}