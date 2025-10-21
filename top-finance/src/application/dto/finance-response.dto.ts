import { FinanceType, FinanceStatus } from '@domain/entities/finance.entity';

export class FinanceResponseDto {
  declare id: string;
  declare userId: string;
  declare tipo: FinanceType;
  declare descricao: string;
  declare valor: number;
  declare status: FinanceStatus;
  declare dataTransacao: Date;
  declare dataPagamento?: Date;
  declare categoria: string;
  declare created: Date;
  declare updated: Date;
}

