import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'TOP_USERS',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('TOP_USERS_HOST', 'localhost'),
            port: configService.get('TOP_USERS_PORT', 5000),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'TOP_FINANCE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('TOP_FINANCE_HOST', 'localhost'),
            port: configService.get('TOP_FINANCE_PORT', 5001),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class GatewayModule {}

