import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GatewayModule } from '@infrastructure/config/gateway.module.js';
import { UsersController } from '@presentation/controllers/users.controller.js';
import { FinancesController } from '@presentation/controllers/finances.controller.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    GatewayModule,
  ],
  controllers: [UsersController, FinancesController],
})
export class AppModule { }

