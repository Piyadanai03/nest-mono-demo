import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LoggerModule } from '@app/shared-lib/logging/logger.module';
import { HttpModule } from '@nestjs/axios';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { ClsModule } from 'nestjs-cls';
import { randomUUID } from 'crypto';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: (req) => req.headers['x-request-id'] ?? randomUUID(),
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    PrometheusModule.register({
      path: '/metrics',
    }),
    PassportModule,
    HttpModule,
    LoggerModule,
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService, JwtService, JwtStrategy],
})
export class ApiGatewayModule {}
