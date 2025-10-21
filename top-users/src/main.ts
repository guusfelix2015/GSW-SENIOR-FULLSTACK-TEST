import 'module-alias/register';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const httpPort = process.env.PORT || 3001;
  const tcpPort = process.env.TCP_PORT || 5000;
  const nodeEnv = process.env.NODE_ENV || 'development';

  console.log(`🚀 Starting Users Microservice...`);
  console.log(`📍 Environment: ${nodeEnv}`);
  console.log(`🔌 HTTP Port: ${httpPort}`);
  console.log(`📡 TCP Port: ${tcpPort}`);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: parseInt(tcpPort as string),
    },
  });

  await app.listen(httpPort);
  console.log(`✅ HTTP Server is running on http://localhost:${httpPort}`);

  await app.startAllMicroservices();
  console.log(`✅ TCP Microservice is running on port ${tcpPort}`);
}

bootstrap().catch((err) => {
  console.error('❌ Failed to start Users Microservice:', err);
  process.exit(1);
});

