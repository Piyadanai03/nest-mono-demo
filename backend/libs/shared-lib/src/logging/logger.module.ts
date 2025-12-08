import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { context, trace } from '@opentelemetry/api';
import { ClsModule, ClsService } from 'nestjs-cls';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule, ClsModule],
      inject: [ConfigService, ClsService],
      useFactory: async (configService: ConfigService, clsService: ClsService) => {
        const serviceName =
          configService.get<string>('OTEL_SERVICE_NAME') ||
          configService.get<string>('SERVICE_NAME') ||
          'unknown-service';

        return {
          pinoHttp: {
            transport: {
              targets: [
                {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                    singleLine: true,
                    translateTime: 'SYS:standard',
                    ignore: 'pid,hostname',
                  },
                },
                {
                  target: 'pino-loki',
                  options: {
                    batching: true,
                    interval: 5,
                    host: 'http://loki:3100',
                    labels: {
                      service: serviceName,
                    },
                  },
                },
              ],
            },
            mixin: () => ({ service: serviceName }),
            redact: {
              paths: ['req.headers.authorization', 'req.body.password'],
              censor: '***REDACTED***',
            },
            autoLogging: {
              ignore: (req) => {
                return req.url === '/metrics';
              },
            },
            customLogLevel: function (req, res, err) {
              if (res.statusCode >= 400 || err) {
                return 'error';
              }
              return 'info';
            },
            serializers: {
              req: (req) => ({
                id: req.id,
                method: req.method,
                url: req.url,
                query: req.query,
                params: req.params,
              }),
              res: (res) => ({ statusCode: res.statusCode }),
            },
            customProps: (req, res) => {
              const span = trace.getSpan(context.active());

              return {
                trace_id: span?.spanContext().traceId, // Trace ID (เดิม)
                userId: clsService.get('userId'), // ✅ User ID (ของใหม่! มาเองอัตโนมัติ)
                requestId: clsService.getId(), // ✅ Request ID (ของใหม่! มาเองอัตโนมัติ)
              };
            },
          },
        };
      },
    }),
  ],
  exports: [PinoLoggerModule],
})
export class LoggerModule {}
