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

@Module({
  imports: [
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