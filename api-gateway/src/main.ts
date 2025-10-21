import 'module-alias/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:5175',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port = configService.get('PORT', 3000);

  await app.listen(port);
  console.log(`🚀 API Gateway is running on http://localhost:${port}`);
  console.log(`📡 Connected to top-users on port ${configService.get('TOP_USERS_PORT', 5000)}`);
  console.log(`📡 Connected to top-finance on port ${configService.get('TOP_FINANCE_PORT', 5001)}`);
}

bootstrap();

