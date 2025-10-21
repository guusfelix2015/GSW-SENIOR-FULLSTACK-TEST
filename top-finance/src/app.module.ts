import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FinanceModule } from './presentation/modules/finance.module';
import { FinanceMicroserviceController } from './presentation/microservice/finance.microservice.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    FinanceModule,
  ],
  controllers: [FinanceMicroserviceController],
  providers: [],
})
export class AppModule { }

