import { Module } from '@nestjs/common';
import { AuthServiceController } from './auth-service.controller';
import { AuthService } from './auth-service.service';
import { PrismaModule } from '@app/prisma';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from '@app/shared-lib/logging/logger.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    PrometheusModule.register({
      path: '/metrics',
    }),
    LoggerModule,
  ],
  controllers: [AuthServiceController],
  providers: [AuthService],
})
export class AuthServiceModule {}
