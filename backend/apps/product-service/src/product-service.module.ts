import { Module } from '@nestjs/common';
import { ProductServiceController } from './product-service.controller';
import { ProductService } from './product-service.service';
import { PrismaModule } from '@app/prisma';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [
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
  ],
  controllers: [ProductServiceController],
  providers: [ProductService],
})
export class ProductServiceModule {}
