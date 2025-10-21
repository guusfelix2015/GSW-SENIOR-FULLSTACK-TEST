import { ConfigService } from '@nestjs/config';
import { ClientOptions, Transport } from '@nestjs/microservices';

export const getMicroservicesConfig = (
  configService: ConfigService,
): Record<string, ClientOptions> => {
  return {
    TOP_USERS: {
      transport: Transport.TCP,
      options: {
        host: configService.get('TOP_USERS_HOST', 'localhost'),
        port: configService.get('TOP_USERS_PORT', 5000),
      },
    },
    TOP_FINANCE: {
      transport: Transport.TCP,
      options: {
        host: configService.get('TOP_FINANCE_HOST', 'localhost'),
        port: configService.get('TOP_FINANCE_PORT', 5001),
      },
    },
  };
};

