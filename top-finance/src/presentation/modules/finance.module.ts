import { Module } from '@nestjs/common';
import { FinanceController } from '../controllers/finance.controller';
import { FinanceService } from '@application/services/finance.service';
import { FinanceRepository } from '@infrastructure/repositories/finance.repository';
import { DatabaseModule } from '@infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [FinanceController],
  providers: [
    FinanceService,
    {
      provide: 'IFinanceRepository',
      useClass: FinanceRepository,
    },
  ],
  exports: [FinanceService],
})
export class FinanceModule {}

