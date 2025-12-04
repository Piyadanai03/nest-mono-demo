docker-compose -f docker-compose.observability.yml down
docker-compose -f docker-compose.observability.yml up -d

docker-compose up -d postgres


npm install @opentelemetry/sdk-node@0.52.1 @opentelemetry/resources@1.26.0 @opentelemetry/semantic-conventions@1.26.0 @opentelemetry/exporter-trace-otlp-grpc@0.52.1 @opentelemetry/auto-instrumentations-node@0.52.1
