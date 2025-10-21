import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Knex from 'knex';

@Module({
  providers: [
    {
      provide: 'Knex',
      useFactory: (configService: ConfigService) => {
        const knex = Knex.default({
          client: 'postgresql',
          connection: {
            host: configService.get('DB_HOST', 'localhost'),
            port: configService.get('DB_PORT', 5433),
            user: configService.get('DB_USER', 'postgres'),
            password: configService.get('DB_PASSWORD', 'postgres'),
            database: configService.get('DB_NAME', 'finance_db'),
            ssl: configService.get('DB_SSL', false) === 'true',
          },
          pool: {
            min: 2,
            max: 10,
          },
        });

        return knex;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['Knex'],
})
export class DatabaseModule {}

