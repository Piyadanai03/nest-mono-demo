import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { context, trace } from '@opentelemetry/api';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
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
              if (!span) return {};
              const { traceId } = span.spanContext();
              return { trace_id: traceId };
            },
          },
        };
      },
    }),
  ],
  exports: [PinoLoggerModule],
})
export class LoggerModule {}
