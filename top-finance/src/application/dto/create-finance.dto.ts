import { FinanceType } from '@domain/entities/finance.entity';

export class CreateFinanceDto {
  declare userId: string;
  declare tipo: FinanceType;
  declare descricao: string;
  declare valor: number;
  declare categoria: string;
  declare dataTransacao?: Date;
}

