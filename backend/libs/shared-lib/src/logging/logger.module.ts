import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

const loggerConfig = {
  pinoHttp: {
    level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
    transport:
      process.env.NODE_ENV !== 'production'
        ? { target: 'pino-pretty', options: { colorize: true } }
        : undefined,
        
    customProps: (req, res) => ({
      correlationId: req.headers['x-request-id'] || req.headers['x-correlation-id'] || null,
      service: process.env.SERVICE_NAME || 'UnknownService',
    }),
    
    redact: {
      paths: ['req.headers.authorization', 'req.body.password', 'req.body.token'],
      censor: '***REDACTED***',
    },
  }
};

@Module({
  imports: [PinoLoggerModule.forRoot(loggerConfig)],
  exports: [PinoLoggerModule],
})
export class LoggerModule {}