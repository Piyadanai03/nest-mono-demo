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
        return {
          pinoHttp: {
            // 1. ตั้งค่าการส่ง Log 2 ทาง (Console + File)
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
                  target: 'pino/file',
                  options: {
                    destination: './logs/app.log',
                    mkdir: true,
                  },
                },
              ],
            },

            // 2. ใส่ชื่อ Service
            base: {
              service: configService.get<string>('SERVICE_NAME') || 'unknown-service',
            },

            // 3. ปิดบังข้อมูล Sensitive
            redact: {
              paths: ['req.headers.authorization', 'req.body.password'],
              censor: '***REDACTED***',
            },

            // 4. เปิด Auto Log เพื่อให้เห็นเคสสำเร็จ (200 OK)
            autoLogging: true,

            // 5. ป้องกัน Log ซ้ำตอน Error (เพราะ GlobalExceptionFilter ทำหน้าที่นั้นแล้ว)
            customLogLevel: function (req, res, err) {
              if (res.statusCode >= 400 || err) {
                return 'silent'; // เงียบไว้ ถ้าเป็น Error
              }
              return 'info'; // Log ปกติ ถ้าสำเร็จ
            },

            // 6. คัดเลือกข้อมูลที่จะ Log (เพื่อไม่ให้รกเกินไป)
            serializers: {
              req: (req) => ({
                id: req.id,
                method: req.method,
                url: req.url,
                query: req.query,
                params: req.params,
              }),
              res: (res) => ({
                statusCode: res.statusCode,
              }),
            },

            // 7. หัวใจสำคัญ: ดึง Trace ID จาก OpenTelemetry มาใส่ใน Log
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